import { Icon } from "@/components/icon/icon";
import Image from "next/image";

export type BlogCordProps = {
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
        <div className="font-medium line-clamp-2 break-all">{title}</div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <div className="relative w-5 h-5 overflow-hidden rounded-full">
              <Image
                src={user.iconImageUrl || "/defaultaveter.svg"}
                alt={user.name}
                fill
              />
            </div>
            <div>{user.name}</div>
          </div>
          <div className="flex gap-1 text-gray">
            <div className="flex items-center gap-0.5">
              <Icon size={20} name="flare" />
              <p className="text-black">{wishedCount}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Icon size={20} name="book" />
              <p className="text-black">{bookmarkedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
