"use client";

import { BlogIndexResponse } from "@/lib/api/blog-index";
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

  return <div></div>;
}
