"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogBookmarkIndexResponse } from "@/lib/api/blog-bookmark-index";
import { BlogIndexResponse } from "@/lib/api/blog-index";
import { BlogWishIndexResponse } from "@/lib/api/blogs-wish-index";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const pathname = usePathname();
  const [mode, setMode] = useState<"index" | "wish" | "bookmark" | null>(null);
  const dammyBlogs = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `タイトル${i + 1}`,
    thumbnailImageUrl: "https://placehold.jp/300x200.png",
    user: {
      id: i,
      name: "テストユーザー",
      iconImageUrl: "https://placehold.jp/200x200.png",
    },
    wishesCount: 23,
    bookmarksCount: 23,
    tags: [
      { id: 1, name: "タグ" },
      { id: 2, name: "タグ" },
      { id: 3, name: "タグ" },
    ],
    updateAt: "60分前",
  }));
  const me = {
    id: 1,
    name: "山田 太郎",
    email: "taro@example.com",
    iconImageUrl: "https://placehold.jp/300x200.png",
    wishesCount: [1, 2, 3],
    bookmarksCount: [10, 20],
  };
  const [indexBlogs, setIndexBlogs] = useState<BlogIndexResponse>(dammyBlogs);
  const [wishedBlogs, setWishedBlogs] =
    useState<BlogBookmarkIndexResponse>(dammyBlogs);
  const [bookmarkedBlogs, setBookmarkedBlogs] =
    useState<BlogWishIndexResponse>(dammyBlogs);

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
      `${window.location.pathname}?${params.toString()}`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const blogs = {
    index: indexBlogs,
    wish: wishedBlogs,
    bookmark: bookmarkedBlogs,
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

  if (!mode) return null;

  return (
    <div className="px-5 mt-16">
      <div className="w-full h-45.25 flex flex-col justify-between items-center">
        <div className="relative w-35 h-35 rounded-full overflow-hidden">
          <Image
            alt={me.name}
            src={me.iconImageUrl}
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
            key={blog.id}
            title={`${blog.title}${mode}`}
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
