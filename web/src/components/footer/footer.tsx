"use client";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon/icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useMeStore } from "@/stores/use-me-store";
import { useEffect, useState, useRef } from "react";

export function Footer() {
  const pathname = usePathname();
  const { me } = useMeStore();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const initialHeightRef = useRef<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    // 初期の高さを保存
    if (initialHeightRef.current === null) {
      initialHeightRef.current = vv.height;
    }

    const handler = () => {
      const currentHeight = vv.height;
      const initialHeight = initialHeightRef.current ?? currentHeight;

      // CSS変数も設定（他で使う場合）
      document.documentElement.style.setProperty(
        "--vh",
        `${currentHeight}px`
      );

      // 初期高さより100px以上小さくなったらキーボード表示とみなす
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

  return (
    <div className="bg-white flex justify-evenly items-center h-16 text-black shadow-[0_-4px_6px_-1px_var(--color-gray)]">
      <Link href="/">
        <div className={cn(pathname == "/" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-12 h-12 text-[8px]">
            <Icon name="home" size={32} />
            ホーム
          </div>
        </div>
      </Link>
      <Link href={me ? "/blogs/create" : "/login"}>
        <div className={cn(pathname == "/blogs/create" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-12 h-12 text-[8px]">
            <Icon name="add" size={32} />
            作成
          </div>
        </div>
      </Link>
      <Link href={me ? "/profile" : "/login"}>
        <div
          className={cn(
            (pathname == "/profile" || pathname == "/login") && "text-primary",
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
      </Link>
    </div>
  );
}