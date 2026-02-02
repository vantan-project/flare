"use client";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon/icon";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();
  return (
    <div className="bg-white flex justify-evenly items-center h-20 text-black shadow-[0_-4px_6px_-1px_var(--color-gray)]">
      <Link href="/">
        <div className={cn(pathname == "/" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-16 h-16 text-[8px]">
            <Icon name="home" size={32} />
            ホーム
          </div>
        </div>
      </Link>
      <Link href="/blogs/create">
        <div className={cn(pathname == "/blogs/create" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-16 h-16 text-[8px]">
            <Icon name="add" size={32} />
            作成
          </div>
        </div>
      </Link>
      <Link href="/profile">
        <div className={cn(pathname == "/profile" && "text-primary")}>
          <div className="flex flex-col items-center justify-center w-16 h-16 text-[8px]">
            <Icon name="profile" size={32} />
            プロフィール
          </div>
        </div>
      </Link>
    </div>
  );
}
