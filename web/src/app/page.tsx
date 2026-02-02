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
  const dammyBlogs2 = Array.from({ length: 4 }, (_, i) => ({
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
  const [newBlogs, setNewBlogs] = useState<BlogIndexResponse>(dammyBlogs2);

  return (
    <div>
      <div className="p-5">
        <div className="font-bold text-[16px] border-b-2 border-primary p-2">
          高熱意度ピックアップ
        </div>
        <div className="p-3" />
        <div className="flex gap-3 overflow-x-auto">
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
        <div className="m-5" />
        <div className="font-bold text-[16px] border-b-2 p-2">
          コア度セレクション
        </div>
        <div className="p-3" />
        <div className="flex gap-3 overflow-x-auto">
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
        <div className="m-5" />
        <div className="mb-3">
          新着投稿
          <Link href="/" className="px-3">
            もっと見る＞
          </Link>
        </div>
        <div className="flex flex-col gap-3">
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
        <div className="m-5" />
      </div>
      <div className="p-20" />
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
