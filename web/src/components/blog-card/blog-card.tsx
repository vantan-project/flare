"use client";
import { Icon } from "@/components/icon/icon";
import { useMeStore } from "@/stores/use-me-store";
import Image from "next/image";

export type BlogCordProps = {
  id: number;
  title: string;
  user: {
    name: string;
    iconImageUrl: string | null;
  };
  bookmarkedCount: number;
  wishedCount: number;
  thumbnailImageUrl: string;
};

export function BlogCard({
  id,
  title,
  user,
  wishedCount,
  bookmarkedCount,
  thumbnailImageUrl,
}: BlogCordProps) {
  const { me } = useMeStore();
  const isBookmarked = me?.bookmarkedIds.includes(id);
  const isWished = me?.wishedIds.includes(id);

  return (
    <div className="w-60">
      <div className="relative w-60 h-35 overflow-hidden rounded-[10px]">
        <Image
          src={thumbnailImageUrl}
          alt="画像なし"
          fill
          className="object-cover"
        />
      </div>
      <div className="font-medium line-clamp-2 break-all h-[2lh] my-2">
        {title}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <div className="relative w-5 h-5 overflow-hidden rounded-full">
            <Image
              src={user.iconImageUrl || "/default-aveter.svg"}
              alt={user.name}
              fill
            />
          </div>
          <div>{user.name}</div>
        </div>
        <div className="flex gap-1 text-gray">
          <div className="flex items-center gap-0.5">
            <Icon size={20} name="flare" className={isBookmarked ? "text-primary" : undefined} />
            <p className="text-black">{bookmarkedCount}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <Icon size={20} name="book" className={isWished ? "text-primary" : undefined} />
            <p className="text-black">{wishedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
