import { Icon } from "@/components/icon/icon";
import Image from "next/image";
import { BookmarkButton } from "../buttons/bookmark-button";
import { WishButton } from "../buttons/wish-button";

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
          <WishButton
            id={id}
            wishedCount={wishedCount}
          />
          <BookmarkButton
            id={id}
            bookmarkedCount={bookmarkedCount}
          />
        </div>
      </div>
    </div>
  );
}
