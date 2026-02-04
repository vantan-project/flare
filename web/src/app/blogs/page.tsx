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

export default function BlogPage() {
  const router = useRouter();
  const [flareBlogs, setFlareRanking] = useState<BlogIndexResponse>([]);
  const [coreBlogs, setCoreRanking] = useState<BlogIndexResponse>([]);
  const [newBlogs, setNewBlogs] = useState<BlogIndexResponse>([]);
  const [search, setSearch] = useState<BlogIndexRequest>();
  const [blogs, setBlogs] = useState<BlogIndexResponse>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);

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
    const strTagIds = params.get("tagIds");
    const tagIds = strTagIds ? JSON.parse(decodeURIComponent(strTagIds)) : [];

    setSearch({ orderBy, limit, offset, userId, daysAgo, tagIds });
  }, []);

  useEffect(() => {
    if (!search) return;
    blogIndex(search).then((res) => setBlogs(res.data));
  }, [search]);

  useEffect(() => {
    const baseQuery = {
      limit: 15,
      offset: null,
      userId: null,
      daysAgo: 7,
      tagIds: [],
    };

    blogIndex({ ...baseQuery, orderBy: "flarePoint" }).then((res) =>
      setFlareRanking(res.data),
    );
    blogIndex({ ...baseQuery, orderBy: "corePoint" }).then((res) =>
      setCoreRanking(res.data),
    );
    blogIndex({ ...baseQuery, orderBy: "createdAt" }).then((res) =>
      setNewBlogs(res.data),
    );
  }, []);

  return (
    <div>
      <div className="flex items-end justify-end pt-[9px] mx-5 gap-2">
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
      <div className="pt-2 pb-3">投稿一覧</div>
      <div className="grid gap-3">
        {blogs.map((b) => (
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
