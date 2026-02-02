"use client";

import { BlogIndexResponse } from "@/lib/api/blog-index";
import { BlogCard } from "@/components/blog-card/blog-card";
import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { Footer } from "@/components/footer/footer";
import Link from "next/link";
import { useState } from "react";

export default function () {
  const dammyBlogs = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `タイトル${i + 1}`,
    thumbnailImageUrl: "https://placehold.jp/200x200.png",
    user: {
      id: i,
      name: "テストユーザー",
      iconImageUrl: "https://placehold.jp/300x200.png",
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

  const [flareBlogs, setFlareRanking] = useState<BlogIndexResponse>(dammyBlogs);
  const [coreBlogs, setCoreRanking] = useState<BlogIndexResponse>(dammyBlogs);
  const [newBlogs, setNewBlogs] = useState<BlogIndexResponse>(dammyBlogs);

  return (
    <div>
      <div className="p-5">
        <div className="font-medium border-b-2 border-primary p-2 mb-3">
          高熱意度ピックアップ
        </div>
        <div className="flex gap-5 overflow-x-auto pb-1">
          {flareBlogs.map((b) => (
            <BlogCard
              key={b.id}
              title={b.title}
              user={b.user}
              wishedCount={b.wishesCount}
              bookmarkedCount={b.bookmarksCount}
              thumbnailImageUrl={b.thumbnailImageUrl}
            />
          ))}
        </div>
        <div className="h-3 mb-5 border-b border-base-hover -mx-5" />
        <div className="font-medium border-b-2 p-2 mb-3">
          コア度セレクション
        </div>
        <div className="h-3" />
        <div className="flex gap-5 overflow-x-auto pb-1">
          {coreBlogs.map((b) => (
            <BlogCard
              key={b.id}
              title={b.title}
              user={b.user}
              wishedCount={b.wishesCount}
              bookmarkedCount={b.bookmarksCount}
              thumbnailImageUrl={b.thumbnailImageUrl}
            />
          ))}
        </div>
        <div className="h-3 mb-5 border-b border-base-hover -mx-5" />
        <div className="mb-3 text-sm">
          新着投稿
          <Link href="/" className="px-3 text-xs">
            もっと見る＞
          </Link>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {newBlogs.map((b) => (
            <BlogSideCard
              key={b.id}
              title={b.title}
              user={b.user}
              wishedCount={b.wishesCount}
              bookmarkedCount={b.bookmarksCount}
              thumbnailImageUrl={b.thumbnailImageUrl}
            />
          ))}
        </div>
        <div className="h-5" />
      </div>
      <div className="h-20" />
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
