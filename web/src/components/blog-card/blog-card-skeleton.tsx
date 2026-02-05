export function BlogCardSkeleton() {
  return (
    <div className="w-60">
      {/* サムネイル画像 */}
      <div className="relative w-60 h-35 overflow-hidden rounded-[10px] skeleton" />

      {/* タイトル */}
      <div className="h-[2lh] my-2 space-y-2">
        <div className="h-[1lh] skeleton rounded" />
        <div className="h-[1lh] w-4/5 skeleton rounded" />
      </div>

      {/* ユーザー情報とアクション */}
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          {/* ユーザーアイコン */}
          <div className="relative w-5 h-5 overflow-hidden rounded-full skeleton" />
          {/* ユーザー名 */}
          <div className="h-4 w-20 skeleton rounded" />
        </div>
        <div className="flex gap-1">
          {/* Wishボタン */}
          <div className="h-6 w-12 skeleton rounded" />
          {/* Bookmarkボタン */}
          <div className="h-6 w-12 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
