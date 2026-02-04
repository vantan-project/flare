"use client";
import {
  blogIndex,
  BlogIndexRequest,
  BlogIndexResponse,
} from "@/lib/api/blog-index";
import { useEffect, useState } from "react";

export default function () {
  const [search, setSearch] = useState<BlogIndexRequest>();
  const [blogs, setBlogs] = useState<BlogIndexResponse>([]);

  useEffect(() => {
    if (!search) return;
    blogIndex(search).then((res) => setBlogs(res.data));
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 1. 文字列リテラル型のキャスト (型ガード)
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
      : "createdAt"; // デフォルト値を設定

    // 2. 数値への変換用ヘルパー（再利用性のため）
    const getNumParam = (
      key: string,
      def?: number,
    ): number | (typeof def extends number ? number : null) => {
      const val = params.get(key);
      const num = val !== null ? Number(val) : NaN;

      if (!isNaN(num)) {
        return num;
      }

      // 数値として不正、またはパラメータが存在しない場合
      return def !== undefined ? def : (null as any);
    };

    const limit = getNumParam("limit", 20);
    const offset = getNumParam("offset", 0);
    const userId = getNumParam("userId");
    const daysAgo = getNumParam("daysAgo");

    // ここで変換した値を使用する
    setSearch({ orderBy, limit, offset, userId, daysAgo });
  }, []);

  return <div />;
}
