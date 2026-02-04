"use client";

import { blogBookmarkDestroy } from "@/lib/api/blog-bookmark-destroy";
import { blogBookmarkStore } from "@/lib/api/blog-bookmark-store";
import { useIsBookmarked, useMeStore } from "@/stores/use-me-store";
import { Icon } from "../icon/icon";
import { useToastStore } from "@/stores/use-toast-store";
import { useState } from "react";

interface BookmarkButtonProps {
  id: number;
  bookmarkedCount: number;
}

export function BookmarkButton({ id, bookmarkedCount }: BookmarkButtonProps) {
  const { me, addBookmark, removeBookmark } = useMeStore();
  const isBookmarked = useIsBookmarked(id);
  const { addToast } = useToastStore();
  const [count, setCount] = useState(bookmarkedCount);

  const handleClick = () => {
    if (isBookmarked) {
      blogBookmarkDestroy(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            removeBookmark(id);
            addToast("success", res.message);
            setCount(count - 1);
          }
        }
        else if (res.status === "error") {
          addToast("error", res.message);
        }
      });
    } else {
      blogBookmarkStore(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            addBookmark(id);
            addToast("success", res.message);
            setCount(count + 1);
          }
        }
        else if (res.status === "error") {
          addToast("error", res.message);
        }
      });
    }
  };

  return (
    <button className="flex items-center gap-0.5 cursor-pointer" onClick={handleClick}>
      <div className={`${isBookmarked && "text-secondary"}`}>
        <Icon
          size={20}
          name="book"
        />
      </div>
      <p className="text-black">{count}</p>
    </button>
  );
}