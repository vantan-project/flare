"use client";
import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { SortSelect } from "@/components/sort-select/sort-select";
import { TagSelect } from "@/components/tag-select/tag-select";
import {
  blogIndex,
  BlogIndexRequest,
  BlogIndexResponse,
} from "@/lib/api/blog-index";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { set } from "react-hook-form";

export default function BlogPage() {
  const router = useRouter();
  const [search, setSearch] = useState<BlogIndexRequest>();
  const [blogs, setBlogs] = useState<BlogIndexResponse>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const rawOrderBy = params.get("orderBy");
    const validOrderBy = [
      "createdAt",
      "flarePoint",
      "corePoint",
      "wish",
      "bookmark",
    ] as const;
    const orderBy = validOrderBy.includes(rawOrderBy as any)
      ? (rawOrderBy as (typeof validOrderBy)[number])
      : "createdAt";

    const getNumParam = (key: string, def: number | null = null) => {
      const val = params.get(key);
      const num = val !== null ? Number(val) : NaN;
      return !isNaN(num) ? num : def;
    };

    const limit = getNumParam("limit", 20) ?? 20;
    const offset = getNumParam("offset", 0) ?? 0;
    const userId = getNumParam("userId");
    const daysAgo = getNumParam("daysAgo");
    const tagIds = JSON.parse(params.get("tagIds") || "[]");
    setTagIds(tagIds);
    setSearch({ orderBy, limit, offset, userId, daysAgo, tagIds });
  }, [searchParams]);

  useEffect(() => {
    if (!search) return;
    blogIndex(search).then((res) => setBlogs(res.data));
  }, [search]);


  if (!search) return null;

  return (
    <div className="px-4">
      <div className="fixed top-12 right-4 flex items-end justify-end pt-[9px] gap-2 z-60">
        <SortSelect
          value={search?.orderBy || null}
          options={[
            {
              value: "createdAt",
              label: "最新順",
              onClick: () => {
                setSearch({ ...search, orderBy: "createdAt" });
              },
            },
            {
              value: "flarePoint",
              label: "熱意度順",
              onClick: () => setSearch({ ...search, orderBy: "flarePoint" }),
            },
            {
              value: "corePoint",
              label: "コア度順",
              onClick: () => setSearch({ ...search, orderBy: "corePoint" }),
            },
            {
              value: "wish",
              label: "やってみたい順",
              onClick: () => setSearch({ ...search, orderBy: "wish" }),
            },
            {
              value: "bookmark",
              label: "ブックマーク順",
              onClick: () => setSearch({ ...search, orderBy: "bookmark" }),
            },
          ]}
        />
        <TagSelect
          value={tagIds}
          onChange={(v) => setTagIds(v)}
          onSearch={() => setSearch({ ...search, tagIds: tagIds })}
        />
      </div>
      <div className="pt-2 pb-3">投稿一覧</div>
      <div className="grid gap-3">
        {blogs.map((b) => (
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
  );
}
