"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { imageStore, ImageStoreRequest } from "@/lib/api/image-store";
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
import { useErrorStore } from "@/stores/use-error-store";
import { useMeStore } from "@/stores/use-me-store";
import { useForm } from "react-hook-form";
import { useToastStore } from "@/stores/use-toast-store";
import { accessToken } from "@/utils/access-token";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userUpdate } from "@/lib/api/user-update";

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const { me, setMe } = useMeStore();
  const { addToast } = useToastStore();
  const [mode, setMode] = useState<"index" | "wish" | "bookmark" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { error: imageError, setError: setImageError } = useErrorStore("image");
  const [iconImageUrlId, setIconImageUrlId] = useState<number | null>(null);
  const [indexBlogs, setIndexBlogs] = useState<BlogIndexResponse>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wishedBlogs, setWishedBlogs] = useState<BlogBookmarkIndexResponse>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogWishIndexResponse>(
    [],
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
      setBookmarkedBlogs(res.data),
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
    <div className="px-5 relative">
      <div
        className="absolute -top-16 right-4 border-b text-main-hover border-main-hover flex gap-2 px-3 py-1 cursor-pointer"
        onClick={() => {
          setMe(null);
          accessToken.remove();
          addToast("success", "ログアウトしました");
          router.push("/");
        }}
      >
        <Icon name="logout" size={24} />
        ログアウト
      </div>
      <div className="w-full h-45.25 flex flex-col justify-between items-center">
        <div className="relative w-35 h-35 rounded-full overflow-hidden">
          <label
            htmlFor="image"
            className={cn(imageError && "bg-error/20 outline-error")}
          >
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (imageError) setImageError("image", "");
                const file = e.target.files?.[0];
                if (!file) return;
                setFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                imageStore({ image: file }).then((res) => {
                  if (res.status === "success") {
                    setMe({ ...me, iconImageUrl: res.imageUrl });
                    userUpdate;
                    addToast("success", "画像を更新しました");
                    return;
                  }

                  addToast("error", "画像アップロードに失敗しました。");
                  setFile(null);
                  setPreviewUrl(null);
                });
              }}
            />
            <Image
              alt={me.name}
              src={
                file
                  ? URL.createObjectURL(file)
                  : me.iconImageUrl || "/default-aveter.svg"
              }
              fill
              className="object-cover"
            />
          </label>
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
