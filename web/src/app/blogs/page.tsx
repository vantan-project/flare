"use client";
import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogSideCardSkeleton } from "@/components/blog-sidecard/blog-sidecard-skeleton";
import { SortSelect } from "@/components/sort-select/sort-select";
import { TagSelect } from "@/components/tag-select/tag-select";
import {
  blogIndex,
  BlogIndexRequest,
  BlogIndexResponse,
} from "@/lib/api/blog-index";
import { Pagination } from "@/components/pagination/pagination";
import { useEffect, useRef, useState } from "react";

const LIMIT = 20;
const VALID_ORDER_BY = [
  "createdAt",
  "flarePoint",
  "corePoint",
  "wish",
  "bookmark",
] as const;

export default function BlogPage() {
  const [search, setSearch] = useState<BlogIndexRequest>();
  const [blogs, setBlogs] = useState<BlogIndexResponse>([]);
  const [orderBy, setOrderBy] =
    useState<BlogIndexRequest["orderBy"]>("createdAt");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [searchTagIds, setSearchTagIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // 初期ロード: クエリパラメーター → state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const rawOrderBy = params.get("orderBy");
    if (VALID_ORDER_BY.includes(rawOrderBy as any)) {
      setOrderBy(rawOrderBy as (typeof VALID_ORDER_BY)[number]);
    }

    const pageParam = Number(params.get("page"));
    if (!isNaN(pageParam) && pageParam >= 1) {
      setPage(pageParam);
    }

    const parsedTagIds = JSON.parse(params.get("tagIds") || "[]");
    if (parsedTagIds.length > 0) {
      setTagIds(parsedTagIds);
      setSearchTagIds(parsedTagIds);
    }

    initialized.current = true;
  }, []);

  // state変更 → クエリパラメーター更新 + search構築
  useEffect(() => {
    if (!initialized.current) return;

    const params = new URLSearchParams();
    if (orderBy !== "createdAt") params.set("orderBy", orderBy);
    if (page > 1) params.set("page", String(page));
    if (searchTagIds.length > 0)
      params.set("tagIds", JSON.stringify(searchTagIds));

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    );

    setSearch({
      orderBy,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
      userId: null,
      daysAgo: null,
      tagIds: searchTagIds,
    });
  }, [page, orderBy, searchTagIds]);

  // データ取得
  useEffect(() => {
    if (!search) return;
    setIsLoading(true);
    blogIndex(search)
      .then((res) => {
        setBlogs(res.data);
        setLastPage(Math.max(1, Math.ceil(res.total / LIMIT)));
      })
      .finally(() => setIsLoading(false));
  }, [search]);

  if (!search) return null;

  return (
    <div>
      <div className="fixed top-24 right-4 flex items-end justify-end gap-2 z-40">
        <SortSelect
          value={orderBy}
          options={[
            {
              value: "createdAt",
              label: "最新順",
              onClick: () => {
                setOrderBy("createdAt");
                setPage(1);
              },
            },
            {
              value: "flarePoint",
              label: "熱意度順",
              onClick: () => {
                setOrderBy("flarePoint");
                setPage(1);
              },
            },
            {
              value: "corePoint",
              label: "コア度順",
              onClick: () => {
                setOrderBy("corePoint");
                setPage(1);
              },
            },
            {
              value: "wish",
              label: "やってみたい順",
              onClick: () => {
                setOrderBy("wish");
                setPage(1);
              },
            },
            {
              value: "bookmark",
              label: "ブックマーク順",
              onClick: () => {
                setOrderBy("bookmark");
                setPage(1);
              },
            },
          ]}
        />
        <TagSelect
          value={tagIds}
          onChange={(v) => setTagIds(v)}
          onSearch={() => {
            setSearchTagIds(tagIds);
            setPage(1);
          }}
        />
      </div>
      <div className="px-5">
        <div className="mb-5 font-medium">投稿一覧</div>
        <div className="grid gap-3">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <BlogSideCardSkeleton key={`blogs-skeleton-${i}`} />
              ))
            : blogs.map((b) => (
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

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onClick={(num) => setPage(num)}
        />
      </div>
    </div>
  );
}