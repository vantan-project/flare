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
        <Link href={"/"}>
          <div className={cn(pathname == "/" && "text-primary")}>
            <Icon name="home" size={32} />
          </div>
        </Link>
        <Link href={"/create"}>
          <div className={cn(pathname == "/create" && "text-primary")}>
            <Icon name="add" size={32} />
          </div>
        </Link>
        <Link href={"/bookMark"}>
          <div className={cn(pathname == "/bookmark" && "text-primary")}>
            <Icon name="book" size={32} />
          </div>
        </Link>
        <Link href={"/profile"}>
          <div className={cn(pathname == "/profile" && "text-primary")}>
            <Icon name="profile" size={32} />
          </div>
        </Link>
      </div>
    </div>
  );
}
