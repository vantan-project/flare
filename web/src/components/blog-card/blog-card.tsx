import Image from "next/image";
import { BookmarkButton } from "../buttons/bookmark-button";
import { WishButton } from "../buttons/wish-button";
import { useRouter } from "next/navigation";
import { useDetailStore } from "@/stores/use-detail-store";

export type BlogCordProps = {
  id: number;
  title: string;
  user: {
    id: number;
    name: string;
    userIconUrl: string | null;
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
  const router = useRouter();
  const { setDetailId } = useDetailStore();

  return (
    <div
      className="w-60"
      onClick={() => router.push(`/blogs/detail?blogId=${id}`)}
    >
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
        <div
          className="flex items-center gap-1 min-w-0 flex-1"
          onClick={(e) => {
            e.stopPropagation(); // 親要素へのクリックイベント伝播を防止
            setDetailId(user.id);
            router.push(`/users/detail?id=${user.id}`);
          }}
        >
          <div className="relative w-5 h-5 overflow-hidden rounded-full shrink-0">
            <Image
              src={user.userIconUrl || "/default-aveter.svg"}
              alt={user.name}
              fill
            />
          </div>
          <div className="truncate">{user.name}</div>
        </div>
        <div className="flex gap-1 text-gray shrink-0">
          <WishButton id={id} wishedCount={wishedCount} />
          <BookmarkButton id={id} bookmarkedCount={bookmarkedCount} />
        </div>
      </div>
    </div>
  );
}
