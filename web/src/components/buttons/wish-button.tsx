"use client";

import { blogWishDestroy } from "@/lib/api/blog-wish-destroy";
import { blogWishStore } from "@/lib/api/blog-wish-store";
import { useIsWished, useMeStore } from "@/stores/use-me-store";
import { Icon } from "../icon/icon";
import { useToastStore } from "@/stores/use-toast-store";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WishButtonProps {
  id: number;
  wishedCount: number;
}

export function WishButton({ id, wishedCount }: WishButtonProps) {
  const { me, addWish, removeWish } = useMeStore();
  const isWished = useIsWished(id);
  const { addToast } = useToastStore();
  const [count, setCount] = useState(wishedCount);

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのクリックイベント伝播を防止
    if (isWished) {
      blogWishDestroy(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            removeWish(id);
            addToast("success", res.message);
            setCount(count - 1);
          }
        } else {
          addToast("error", "やってみたいの登録にはログインが必要です");
          router.push("/login");
        }
      });
    } else {
      blogWishStore(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            addWish(id);
            addToast("success", res.message);
            setCount(count + 1);
          }
        } else {
          addToast("error", "やってみたいの登録にはログインが必要です");
          router.push("/login");
        }
      });
    }
  };

  return (
    <button
      className="flex items-center gap-0.5 cursor-pointer"
      onClick={handleClick}
    >
      <div className={`${isWished && "text-primary"}`}>
        <Icon size={24} name="flare" />
      </div>
      <p className="text-black">{count}</p>
    </button>
  );
}
