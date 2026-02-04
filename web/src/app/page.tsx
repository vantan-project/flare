"use client";

import { blogIndex, BlogIndexResponse } from "@/lib/api/blog-index";
import { useEffect } from "react";
import { BlogCard } from "@/components/blog-card/blog-card";
import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import Link from "next/link";
import { useState } from "react";

function Page() {
  const [flareBlogs, setFlareRanking] = useState<BlogIndexResponse>([]);
  const [coreBlogs, setCoreRanking] = useState<BlogIndexResponse>([]);
  const [newBlogs, setNewBlogs] = useState<BlogIndexResponse>([]);

  try {
    useEffect(() => {
      blogIndex({
        orderBy: "flarePoint",
        limit: 15,
        offset: null,
        userId: null,
        daysAgo: 7,
      }).then((res) => setFlareRanking(res.data));

      blogIndex({
        orderBy: "corePoint",
        limit: 15,
        offset: null,
        userId: null,
        daysAgo: 7,
      }).then((res) => setCoreRanking(res.data));

      blogIndex({
        orderBy: "createdAt",
        limit: 15,
        offset: null,
        userId: null,
        daysAgo: 7,
      }).then((res) => setNewBlogs(res.data));
    }, []);
  } catch (error) {
    return;
  }

  return (
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
      <div className="font-medium border-b-2 p-2 mb-3">コア度セレクション</div>
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
    </div>
  );
}
export default Page;
