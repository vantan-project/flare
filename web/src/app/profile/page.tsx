"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogBookmarkIndexResponse } from "@/lib/api/blog-bookmark-index";
import { BlogIndexResponse } from "@/lib/api/blog-index";
import { BlogWishIndexResponse } from "@/lib/api/blogs-wish-index";
import { useEffect, useState } from "react";

export default function () {
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
  const [blogs, setBlogs] = useState<BlogIndexResponse>(dammyBlogs);
  useEffect(() => {
    console.log(blogs);
  }, [blogs]);
  // const [bookmarkedBlogs, setBookmarkedBlogs] =
  //   useState<BlogWishIndexResponse>(dammyBlogs);
  // const [wishedBlogs, setWishedBlogs] =
  //   useState<BlogBookmarkIndexResponse>(dammyBlogs);

  return (
    <div>
      {/* title: string;
      user: {
        name: string;
        iconImageUrl: string | null;
      };
      bookmarkedCount: number;
      wishedCount: number;
      thumbnailImageUrl: string; */}
      <BlogSideCard
        title={blogs[0].title}
        thumbnailImageUrl={blogs[0].thumbnailImageUrl}
        user={blogs[0].user}
        bookmarkedCount={blogs[0].bookmarksCount}
        wishedCount={blogs[0].wishesCount}
      />
    </div>
  );
}
