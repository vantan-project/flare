"use client";

import { blogBookmarkDestroy } from "@/lib/api/blog-bookmark-destroy";
import { blogBookmarkStore } from "@/lib/api/blog-bookmark-store";
import { useIsBookmarked, useMeStore } from "@/stores/use-me-store";
import { Icon } from "../icon/icon";
import { useToastStore } from "@/stores/use-toast-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface BookmarkLabelButtonProps {
  id: number;
}

export function BookmarkLabelButton({ id }: BookmarkLabelButtonProps) {
  const { me, addBookmark, removeBookmark } = useMeStore();
  const isBookmarked = useIsBookmarked(id);
  const { addToast } = useToastStore();

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのクリックイベント伝播を防止
    if (isBookmarked) {
      blogBookmarkDestroy(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            removeBookmark(id);
            addToast("success", res.message);
          }
        } else {
          addToast("error", "ブックマークの登録にはログインが必要です");
          router.push("/login");
        }
      });
    } else {
      blogBookmarkStore(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            addBookmark(id);
            addToast("success", res.message);
          }
        } else {
          addToast("error", "ブックマークの登録にはログインが必要です");
          router.push("/login");
        }
      });
    }
  };

  return (
    <button
      className={cn(
        "w-fit py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer text-white",
        isBookmarked ? "bg-secondary text-black" : "bg-main",
      )}
      onClick={handleClick}
    >
      <Icon size={24} name="book" />
      <p>ブックマーク</p>
    </button>
  );
}
