"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
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
import { useMeStore } from "@/stores/use-me-store";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const pathname = usePathname();
  const { me } = useMeStore();
  const [mode, setMode] = useState<"index" | "wish" | "bookmark" | null>(null);

  const [indexBlogs, setIndexBlogs] = useState<BlogIndexResponse>([]);
  const [wishedBlogs, setWishedBlogs] = useState<BlogBookmarkIndexResponse>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogWishIndexResponse>(
    []
  );
  const blogs = {
    index: indexBlogs,
    wish: wishedBlogs,
    bookmark: bookmarkedBlogs,
  };

  const [indexSearch, setIndexSearch] = useState<BlogIndexRequest>();
  const [wishSearch, setWishSearch] = useState<BlogWishIndexRequest>();
  const [bookmarkSearch, setBookmarkSearch] =
    useState<BlogBookmarkIndexRequest>();

  useEffect(() => {
    if (!me) return;
    const orderBy: BlogIndexRequest["orderBy"] = "createdAt";
    const req = {
      orderBy,
      limit: 20,
      offset: 0,
      daysAgo: null,
      userId: me.id,
      tagIds: [],
    };

    setIndexSearch(req);
    setWishSearch({
      limit: req.limit,
      offset: req.offset,
    });
    setBookmarkSearch({
      limit: req.limit,
      offset: req.offset,
    });
  }, [me]);

  useEffect(() => {
    if (!indexSearch) return;
    blogIndex(indexSearch).then((res) => setIndexBlogs(res.data));
  }, [indexSearch]);

  useEffect(() => {
    if (!wishSearch) return;
    blogWishIndex(wishSearch).then((res) => setWishedBlogs(res.data));
  }, [wishSearch]);

  useEffect(() => {
    if (!bookmarkSearch) return;
    blogBookmarkIndex(bookmarkSearch).then((res) =>
      setBookmarkedBlogs(res.data)
    );
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
    const updateModeFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("mode");
      if (value === "wish" || value === "bookmark") {
        setMode(value);
        return;
      }

      setMode("index");
    };
    updateModeFromURL();
    window.addEventListener("popstate", updateModeFromURL);
    return () => {
      window.removeEventListener("popstate", updateModeFromURL);
    };
  }, [pathname]);

  if (!mode || !me) return null;

  return (
    <div className="px-5 mt-16">
      <div className="w-full h-45.25 flex flex-col justify-between items-center">
        <div className="relative w-35 h-35 rounded-full overflow-hidden">
          <Image
            alt={me.name}
            src={me.iconImageUrl || "/default-aveter.svg"}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-6 font-medium">{me.name}</div>
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
        {blogs[mode].map((blog) => (
          <BlogSideCard
            id={blog.id}
            key={blog.id}
            title={blog.title}
            user={blog.user}
            thumbnailImageUrl={blog.thumbnailImageUrl}
            wishedCount={23}
            bookmarkedCount={23}
          />
        ))}
      </div>
    </div>
  );
}
