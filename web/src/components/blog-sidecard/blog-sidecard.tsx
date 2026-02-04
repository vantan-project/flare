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

export function BlogSideCard({
  id,
  title,
  user,
  wishedCount,
  bookmarkedCount,
  thumbnailImageUrl,
}: BlogCordProps) {
  return (
    <div className="grid grid-cols-[86px_auto] gap-3 border-b pb-2">
      <div className="relative w-21.5 h-12.5 overflow-hidden rounded-[10px]">
        <Image
          src={thumbnailImageUrl}
          alt="画像なし"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="font-medium line-clamp-2 break-all leading-4 h-8">
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
            <div className="text-[12px]">{user.name}</div>
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
    </div>
  );
}
