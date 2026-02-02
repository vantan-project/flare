"use client";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon/icon";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();
  return (
    <div>
      <div className="bg-white flex justify-evenly p-4">
        <Link href="/">
          <div className={cn(pathname == "/" && "text-primary")}>
            <div className="w-8 h-8 text-center text-[8px]">
              <Icon name="home" size={32} />
              ホーム
            </div>
          </div>
        </Link>
        <Link href="/create">
          <div className={cn(pathname == "/create" && "text-primary")}>
            <div className="w-8 h-8 text-center text-[8px]">
              <Icon name="add" size={32} />
              作成
            </div>
          </div>
        </Link>
        <Link href="/bookMark">
          <div className={cn(pathname == "/bookmark" && "text-primary")}>
            <div className="w-8 h-8">
              <Icon name="book" size={32} />
              <div className="text-center text-[8px] text-nowrap -indent-2">
                ブックマーク
              </div>
            </div>
          </div>
        </Link>
        <Link href="/profile">
          <div className={cn(pathname == "/profile" && "text-primary")}>
            <div className="w-8 h-8">
              <Icon name="profile" size={32} />
              <div className="text-center text-[8px] text-nowrap -indent-2">
                プロフィール
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
