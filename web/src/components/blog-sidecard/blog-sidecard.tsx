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
      <Image
        src="/bliss_1_m.jpg"
        alt="画像なし"
        width={86}
        height={50}
        className="rounded-xl"
      />
      <div className="flex flex-col gap-2">
        <div className="font-bold line-clamp-2 wrap-break-word h-[2lh]">
          {title}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-1">
            <Icon size={24} name="person" />
            <div>{user.name}</div>
          </div>
          <div className="flex gap-1">
            <div className="flex gap-0.5">
              <Icon size={24} name="flare" />
              {wishedCount}
            </div>
            <div className="flex gap-0.5">
              <Icon size={24} name="book" />
              <div>{bookmarkedCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
