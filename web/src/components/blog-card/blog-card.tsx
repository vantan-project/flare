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

export function BlogCard({
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
      <div className="font-bold line-clamp-2 break-all h-[2lh] my-2">
        {title}
      </div>
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
            <Icon size={20} name="book" />
            <p className="text-black">{wishedCount}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <Icon size={20} name="flare" />
            <p className="text-black">{bookmarkedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
