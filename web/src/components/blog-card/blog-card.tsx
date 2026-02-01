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
      <div className="relative w-60 h-35 overflow-hidden rounded-xl">
        <Image
          src={thumbnailImageUrl}
          alt="画像なし"
          fill
          className="object-cover"
        />
      </div>
      <div className="font-bold line-clamp-2 wrap-break-word h-[2lh] my-2">
        {title}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Icon size={24} name="person" />
            <div>{user.name}</div>
          </div>
          <div className="flex gap-1">
            <div className="flex gap-0.5">
              <Icon size={24} name="book" />
              {wishedCount}
            </div>
            <div className="flex gap-0.5">
              <Icon size={24} name="flare" />
              <div>{bookmarkedCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
