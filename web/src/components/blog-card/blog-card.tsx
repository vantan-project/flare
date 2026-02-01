import { title } from "node:process";
import { Icon } from "@/components/icon/icon";
import Image from "next/image";

export type BlogCordProps = {
  title: string;
  username: string;
  bookmark: number;
  fire: number;
  thumbnailImageUrl: string;
};

export function BlogCard({ title, username, bookmark, fire }: BlogCordProps) {
  return (
    <div className="w-60">
      <Image
        src="/"
        alt="画像なし"
        width={240}
        height={140}
        className="rounded-xl"
      />
      <div className="font-bold table-auto">{title}</div>
      <div className="flex items-center gap-4 -space-x-2">
        <div className="flex -space-x-3 gap-4">
          <Icon size={24} name="person" />
          <div>{username}</div>
        </div>
        <div className="ml-auto flex items-center">
          <Icon size={24} name="flare" />
          <div>{bookmark}</div>
          <Icon size={24} name="book" />
          <div>{fire}</div>
        </div>
      </div>
    </div>
  );
}
