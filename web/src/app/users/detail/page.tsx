"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogSideCardSkeleton } from "@/components/blog-sidecard/blog-sidecard-skeleton";
import { Icon } from "@/components/icon/icon";
import {
  BlogBookmarkIndexRequest,
  BlogBookmarkIndexResponse,
  blogBookmarkIndex,
} from "@/lib/api/blog-bookmark-index";
import {
  BlogIndexRequest,
  BlogIndexResponse,
  blogIndex,
} from "@/lib/api/blog-index";
import {
  BlogWishIndexRequest,
  BlogWishIndexResponse,
  blogWishIndex,
} from "@/lib/api/blogs-wish-index";
import { userShow, UserShowResponse } from "@/lib/api/user-show";
import { useDetailStore } from "@/stores/use-detail-store";
import { useMeStore } from "@/stores/use-me-store";
import { useToastStore } from "@/stores/use-toast-store";
import { accessToken } from "@/utils/access-token";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToastStore();
  const { setMe } = useMeStore();
  const { detailId, setDetailId } = useDetailStore();
  const [mode, setMode] = useState<"index" | "wish" | "bookmark" | null>(null);

  const [user, setUser] = useState<UserShowResponse | null>(null);
  const [indexBlogs, setIndexBlogs] = useState<BlogIndexResponse>([]);
  const [wishedBlogs, setWishedBlogs] = useState<BlogBookmarkIndexResponse>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogWishIndexResponse>(
    [],
  );
  const [isLoading, setIsLoading] = useState<
    Record<"index" | "wish" | "bookmark", boolean>
  >({
    index: true,
    wish: true,
    bookmark: true,
  });
  const blogs = {
    index: indexBlogs,
    wish: wishedBlogs,
    bookmark: bookmarkedBlogs,
  };

  const [indexSearch, setIndexSearch] = useState<BlogIndexRequest>();
  const [wishSearch, setWishSearch] = useState<BlogWishIndexRequest>();
  const [bookmarkSearch, setBookmarkSearch] =
    useState<BlogBookmarkIndexRequest>();

  const handleLogout = () => {
    setMe(null);
    accessToken.remove();
    addToast("success", "ログアウトしました");
    router.push("/");
  };

  useEffect(() => {
    if (!detailId) return;
    const orderBy: BlogIndexRequest["orderBy"] = "createdAt";
    const req = {
      orderBy,
      limit: 20,
      offset: 0,
      daysAgo: null,
      userId: detailId,
      tagIds: [],
    };

    setIndexSearch(req);
    setWishSearch({
      limit: req.limit,
      offset: req.offset,
      userId: req.userId,
    });
    setBookmarkSearch({
      limit: req.limit,
      offset: req.offset,
      userId: req.userId,
    });
  }, [detailId]);

  useEffect(() => {
    if (!detailId) return;
    userShow(detailId).then((res) => setUser(res.data));
  }, [detailId]);

  useEffect(() => {
    if (!indexSearch) return;
    setIsLoading((prev) => ({ ...prev, index: true }));
    blogIndex(indexSearch)
      .then((res) => setIndexBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, index: false })));
  }, [indexSearch]);

  useEffect(() => {
    if (!wishSearch) return;
    setIsLoading((prev) => ({ ...prev, wish: true }));
    blogWishIndex(wishSearch)
      .then((res) => setWishedBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, wish: false })));
  }, [wishSearch]);

  useEffect(() => {
    if (!bookmarkSearch) return;
    setIsLoading((prev) => ({ ...prev, bookmark: true }));
    blogBookmarkIndex(bookmarkSearch)
      .then((res) => setBookmarkedBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, bookmark: false })));
  }, [bookmarkSearch]);

  const changeMode = (mode: "index" | "wish" | "bookmark") => {
    const params = new URLSearchParams(window.location.search);
    switch (mode) {
      case "index":
        params.delete("mode");
        break;
      case "wish":
        params.set("mode", "wish");
        break;
      case "bookmark":
        params.set("mode", "bookmark");
        break;
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const updateFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && !isNaN(Number(id))) {
        setDetailId(Number(id));
      }

      const mode = params.get("mode");
      if (mode === "wish" || mode === "bookmark") {
        setMode(mode);
        return;
      }

      setMode("index");
    };
    updateFromURL();
    window.addEventListener("popstate", updateFromURL);
    return () => {
      window.removeEventListener("popstate", updateFromURL);
    };
  }, [pathname]);

  if (!user || !mode) return null;

  return (
    <div className="px-5 relative">
      <div className="w-full h-45.25 flex flex-col justify-between items-center">
        <div className="relative w-35 h-35 rounded-full overflow-hidden">
          <Image
            alt={user.name}
            src={user.iconImageUrl || "/default-aveter.svg"}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-6 font-medium">{user.name}</div>
      </div>
      <div className="h-7.75 p-1.5 mt-15 mb-8.5 text-gray border-t border-gray -mx-5">
        <div className="py-1.5 mb-1 flex gap-5 text-4 font-medium px-5">
          <button
            className={cn("pb-2", mode === "index" && "text-black border-b")}
            onClick={() => changeMode("index")}
          >
            投稿一覧
          </button>
          <button
            className={cn("pb-2", mode === "wish" && "text-black border-b")}
            onClick={() => changeMode("wish")}
          >
            やってみたい
          </button>
          <button
            className={cn("pb-2", mode === "bookmark" && "text-black border-b")}
            onClick={() => changeMode("bookmark")}
          >
            ブックマーク
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading[mode]
          ? Array.from({ length: 6 }).map((_, i) => (
              <BlogSideCardSkeleton key={`profile-skeleton-${i}`} />
            ))
          : blogs[mode].map((blog) => (
              <BlogSideCard
                id={blog.id}
                key={blog.id}
                title={blog.title}
                user={blog.user}
                thumbnailImageUrl={blog.thumbnailImageUrl}
                wishedCount={blog.wishesCount}
                bookmarkedCount={blog.bookmarksCount}
              />
            ))}
      </div>
    </div>
  );
}
