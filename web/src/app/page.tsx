"use client";

import { blogIndex, BlogIndexResponse } from "@/lib/api/blog-index";
import { SortSelect } from "@/components/sort-select/sort-select";
import { TagSelect } from "@/components/tag-select/tag-select";
import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog-card/blog-card";
import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogCardSkeleton } from "@/components/blog-card/blog-card-skeleton";
import { BlogSideCardSkeleton } from "@/components/blog-sidecard/blog-sidecard-skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [flareBlogs, setFlareRanking] = useState<BlogIndexResponse>([]);
  const [coreBlogs, setCoreRanking] = useState<BlogIndexResponse>([]);
  const [newBlogs, setNewBlogs] = useState<BlogIndexResponse>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  try {
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [flareRes, coreRes, newRes] = await Promise.all([
            blogIndex({
              orderBy: "flarePoint",
              limit: 15,
              offset: null,
              userId: null,
              daysAgo: 7,
              tagIds: [],
            }),
            blogIndex({
              orderBy: "corePoint",
              limit: 15,
              offset: null,
              userId: null,
              daysAgo: 7,
              tagIds: [],
            }),
            blogIndex({
              orderBy: "createdAt",
              limit: 15,
              offset: null,
              userId: null,
              daysAgo: 7,
              tagIds: [],
            }),
          ]);

          setFlareRanking(flareRes.data);
          setCoreRanking(coreRes.data);
          setNewBlogs(newRes.data);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);
  } catch (error) {
    return;
  }

  return (
    <div>
      <div className="fixed top-24 right-4 flex items-end justify-end gap-2 z-40">
        <SortSelect
          value={null}
          options={[
            {
              value: "createdAt",
              label: "最新順",
              onClick: () => router.push("/blogs?orderBy=createdAt"),
            },
            {
              value: "flarePoint",
              label: "熱意度順",
              onClick: () => router.push("/blogs?orderBy=flarePoint"),
            },
            {
              value: "corePoint",
              label: "コア度順",
              onClick: () => router.push("/blogs?orderBy=corePoint"),
            },
            {
              value: "wish",
              label: "やってみたい順",
              onClick: () => router.push("/blogs?orderBy=wish"),
            },
            {
              value: "bookmark",
              label: "ブックマーク順",
              onClick: () => router.push("/blogs?orderBy=bookmark"),
            },
          ]}
        />

        <TagSelect
          value={tagIds}
          onChange={(v) => setTagIds(v)}
          onSearch={() =>
            router.push(
              `/blogs?tagIds=${encodeURIComponent(JSON.stringify(tagIds))}`,
            )
          }
        />
      </div>

      <div className="px-5">
        <div className="font-medium border-b-2 border-primary p-2 mb-3">
          高熱意度ピックアップ
        </div>
        <div className="flex gap-5 overflow-x-auto pb-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <BlogCardSkeleton key={`flare-skeleton-${i}`} />
              ))
            : flareBlogs.map((b) => (
                <BlogCard
                  id={b.id}
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
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <BlogCardSkeleton key={`core-skeleton-${i}`} />
              ))
            : coreBlogs.map((b) => (
                <BlogCard
                  id={b.id}
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
          <Link href="/blogs" className="px-3 text-xs">
            もっと見る＞
          </Link>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <BlogSideCardSkeleton key={`new-skeleton-${i}`} />
              ))
            : newBlogs.map((b) => (
                <BlogSideCard
                  id={b.id}
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

    </div>
  );
}
export default Page;
