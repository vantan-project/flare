"use client";

import { blogWishDestroy } from "@/lib/api/blog-wish-destroy";
import { blogWishStore } from "@/lib/api/blog-wish-store";
import { useIsWished, useMeStore } from "@/stores/use-me-store";
import { Icon } from "../icon/icon";
import { useToastStore } from "@/stores/use-toast-store";
import { useState } from "react";

interface WishButtonProps {
  id: number;
  wishedCount: number;
}

export function WishButton({ id, wishedCount }: WishButtonProps) {
  const { me, addWish, removeWish } = useMeStore();
  const isWished = useIsWished(id)
  const { addToast } = useToastStore();
  const [count, setCount] = useState(wishedCount);

  const handleClick = () => {
    if (isWished) {
      blogWishDestroy(id).then((res) => {
        if (res.status === "success") {
          if (me) {
            removeWish(id);
            addToast("success", res.message);
            setCount(count - 1);
          }
        }
        else if (res.status === "error") {
          addToast("error", res.message);
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
        }
        else if (res.status === "error") {
          addToast("error", res.message);
        }
      });
    }
  };

  return (
    <button className="flex items-center gap-0.5" onClick={handleClick}>
      <div className={`${isWished && "text-primary"}`}>
        <Icon
          size={20}
          name="flare"
        />
      </div>
      <p className="text-black">{count}</p>
    </button>
  );
}