"use client";

import { blogWishDestroy } from "@/lib/api/blog-wish-destroy";
import { blogWishStore } from "@/lib/api/blog-wish-store";
import { useIsWished, useMeStore } from "@/stores/use-me-store";
import { Icon } from "../icon/icon";
import { useToastStore } from "@/stores/use-toast-store";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface WishLabelButtonProps {
  id: number;
}

export function WishLabelButton({ id }: WishLabelButtonProps) {
  const { me, addWish, removeWish } = useMeStore();
  const isWished = useIsWished(id);
  const { addToast } = useToastStore();

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのクリックイベント伝播を防止
    if (isWished) {
      blogWishDestroy(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            removeWish(id);
            addToast("success", res.message);
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
      className={cn(
        "w-fit py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer text-white",
        isWished ? "bg-primary" : "bg-main",
      )}
      onClick={handleClick}
    >
      <Icon size={24} name="flare" />
      <p>やってみたい</p>
    </button>
  );
}
