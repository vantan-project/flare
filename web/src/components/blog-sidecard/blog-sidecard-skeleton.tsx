export function BlogSideCardSkeleton() {
  return (
    <div className="grid grid-cols-[86px_auto] gap-3 border-b pb-2">
      {/* サムネイル画像 */}
      <div className="relative w-21.5 h-12.5 overflow-hidden rounded-[10px] skeleton" />

      <div className="flex flex-col gap-2">
        {/* タイトル */}
        <div className="h-8 space-y-1">
          <div className="h-4 skeleton rounded" />
          <div className="h-4 w-4/5 skeleton rounded" />
        </div>

        {/* ユーザー情報とアクション */}
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            {/* ユーザーアイコン */}
            <div className="relative w-5 h-5 overflow-hidden rounded-full skeleton" />
            {/* ユーザー名 */}
            <div className="h-3 w-16 skeleton rounded" />
          </div>
          <div className="flex gap-1">
            {/* Wishボタン */}
            <div className="h-5 w-10 skeleton rounded" />
            {/* Bookmarkボタン */}
            <div className="h-5 w-10 skeleton rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
