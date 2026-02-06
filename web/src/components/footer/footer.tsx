"use client";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icon/icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useMeStore } from "@/stores/use-me-store";
import { useEffect, useState, useRef } from "react";
import { useDetailStore } from "@/stores/use-detail-store";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { me } = useMeStore();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const initialHeightRef = useRef<number | null>(null);
  const { detailId, setDetailId } = useDetailStore();

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    if (initialHeightRef.current === null) {
      initialHeightRef.current = vv.height;
    }

    const handler = () => {
      const currentHeight = vv.height;
      const initialHeight = initialHeightRef.current ?? currentHeight;

      document.documentElement.style.setProperty("--vh", `${currentHeight}px`);

      const threshold = 100;
      setIsKeyboardVisible(initialHeight - currentHeight > threshold);
    };

    vv.addEventListener("resize", handler);
    handler();

    return () => vv.removeEventListener("resize", handler);
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  if (me === undefined) {
    return null;
  }

  return (
    <div className="bg-white flex justify-evenly items-center h-16 text-black shadow-[0_-4px_6px_-1px_var(--color-gray)]">
      <Link href="/">
        <div className={cn(pathname === "/" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-12 h-12 text-[8px]">
            <Icon name="home" size={32} />
            ホーム
          </div>
        </div>
      </Link>
      <Link href={me ? "/blogs/create" : "/login"}>
        <div className={cn(pathname === "/blogs/create" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-12 h-12 text-[8px]">
            <Icon name="add" size={32} />
            作成
          </div>
        </div>
      </Link>
      <button
        onClick={() => {
          if (me) {
            setDetailId(me.id);
            router.push(`/users/detail?id=${me.id}`);
            return;
          }

          router.push("/login");
        }}
      >
        <div
          className={cn(
            (detailId === me?.id || pathname === "/login") && "text-primary",
          )}
        >
          <div className="flex flex-col items-center justify-center w-12 h-12 text-[8px]">
            {me ? (
              <>
                <Icon name="profile" size={32} />
                プロフィール
              </>
            ) : (
              <>
                <Icon name="login" size={32} />
                ログイン
              </>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
