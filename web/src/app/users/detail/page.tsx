"use client";

import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";
import { BlogSideCardSkeleton } from "@/components/blog-sidecard/blog-sidecard-skeleton";
import { SettingDrawer } from "@/components/drawer/setting-drawer";
import { Icon } from "@/components/icon/icon";
import {
  BlogBookmarkIndexRequest,
  BlogBookmarkIndexResponse,
  blogBookmarkIndex,
} from "@/lib/api/blog-bookmark-index";
import {
  BlogIndexRequest,
  BlogIndexResponse,
  blogIndex,
} from "@/lib/api/blog-index";
import {
  BlogWishIndexRequest,
  BlogWishIndexResponse,
  blogWishIndex,
} from "@/lib/api/blogs-wish-index";
import { userShow, UserShowResponse } from "@/lib/api/user-show";
import { useDetailStore } from "@/stores/use-detail-store";
import { useMeStore } from "@/stores/use-me-store";
import { useToastStore } from "@/stores/use-toast-store";
import { accessToken } from "@/utils/access-token";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/buttons/edit-button";
import { imageStore } from "@/lib/api/image-store";
import { userUpdate, UserUpdateRequest } from "@/lib/api/user-update";
import { authDestory } from "@/lib/api/auth-destory";

export default function () {
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToastStore();
  const { setMe } = useMeStore();
  const { detailId, setDetailId } = useDetailStore();
  const [mode, setMode] = useState<"index" | "wish" | "bookmark" | null>(null);

  const [user, setUser] = useState<UserShowResponse | null>(null);
  const [indexBlogs, setIndexBlogs] = useState<BlogIndexResponse>([]);
  const [wishedBlogs, setWishedBlogs] = useState<BlogBookmarkIndexResponse>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogWishIndexResponse>(
    [],
  );
  const [isLoading, setIsLoading] = useState<
    Record<"index" | "wish" | "bookmark", boolean>
  >({
    index: true,
    wish: true,
    bookmark: true,
  });
  const blogs = {
    index: indexBlogs,
    wish: wishedBlogs,
    bookmark: bookmarkedBlogs,
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type UserSettingForm = {
    name: string;
    iconImageId: number | undefined;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { dirtyFields, isSubmitting },
  } = useForm<UserSettingForm>();

  // ドロワーが開いたときにフォームの初期値をセット
  useEffect(() => {
    if (isDrawerOpen && user) {
      reset({ name: user.name, iconImageId: undefined });
      setIsEditingName(false);
      setIconPreview(null);
    }
  }, [isDrawerOpen, user]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    setIconPreview(URL.createObjectURL(file));

    // 画像アップロードAPI
    imageStore({ image: file })
      .then((res) => {
        if (res.status === "success") {
          setValue("iconImageId", res.imageId, { shouldDirty: true });
          return;
        }
        addToast("error", "画像アップロードに失敗しました。");
        setIconPreview(null);
      })
      .catch(() => {
        addToast("error", "画像アップロードに失敗しました。");
        setIconPreview(null);
      })
      .finally(() => (e.target.value = ""));
  };

  const onSettingSubmit = (values: UserSettingForm) => {
    // dirtyFieldsのみをPATCH
    const patchData: UserUpdateRequest = {};
    if (dirtyFields.name) patchData.name = values.name;
    if (dirtyFields.iconImageId) patchData.iconImageId = values.iconImageId;

    if (Object.keys(patchData).length === 0) {
      addToast("error", "変更がありません。");
      return;
    }

    userUpdate(patchData).then((res) => {
      switch (res.status) {
        case "success":
          addToast("success", "アカウント設定を更新しました。");
          // ユーザー情報を再取得
          if (detailId) {
            userShow(detailId).then((res) => setUser(res.data));
          }
          setIsDrawerOpen(false);
          break;
        case "error":
          addToast("error", res.message);
          break;
        case "validation":
          // バリデーションエラーをトースト表示
          const messages = Object.values(res.fieldErrors).join("\n");
          addToast("error", messages);
          break;
      }
    });
  };

  const [indexSearch, setIndexSearch] = useState<BlogIndexRequest>();
  const [wishSearch, setWishSearch] = useState<BlogWishIndexRequest>();
  const [bookmarkSearch, setBookmarkSearch] =
    useState<BlogBookmarkIndexRequest>();

  const handleLogout = () => {
    setMe(null);
    accessToken.remove();
    addToast("success", "ログアウトしました");
    router.push("/");
  };

  const handleAccountDelete = () => {
    authDestory().then((res) => {
      if (res.status === "success") {
        setMe(null);
        accessToken.remove();
        addToast("success", res.message);
        router.push("/");
      } else if (res.status === "error") {
        addToast("error", res.message);
      }
    })
  }

  useEffect(() => {
    if (!detailId) return;
    const orderBy: BlogIndexRequest["orderBy"] = "createdAt";
    const req = {
      orderBy,
      limit: 20,
      offset: 0,
      daysAgo: null,
      userId: detailId,
      tagIds: [],
    };

    setIndexSearch(req);
    setWishSearch({
      limit: req.limit,
      offset: req.offset,
      userId: req.userId,
    });
    setBookmarkSearch({
      limit: req.limit,
      offset: req.offset,
      userId: req.userId,
    });
  }, [detailId]);

  useEffect(() => {
    if (!detailId) return;
    userShow(detailId).then((res) => setUser(res.data));
  }, [detailId]);

  useEffect(() => {
    if (!indexSearch) return;
    setIsLoading((prev) => ({ ...prev, index: true }));
    blogIndex(indexSearch)
      .then((res) => setIndexBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, index: false })));
  }, [indexSearch]);

  useEffect(() => {
    if (!wishSearch) return;
    setIsLoading((prev) => ({ ...prev, wish: true }));
    blogWishIndex(wishSearch)
      .then((res) => setWishedBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, wish: false })));
  }, [wishSearch]);

  useEffect(() => {
    if (!bookmarkSearch) return;
    setIsLoading((prev) => ({ ...prev, bookmark: true }));
    blogBookmarkIndex(bookmarkSearch)
      .then((res) => setBookmarkedBlogs(res.data))
      .finally(() => setIsLoading((prev) => ({ ...prev, bookmark: false })));
  }, [bookmarkSearch]);

  const changeMode = (mode: "index" | "wish" | "bookmark") => {
    const params = new URLSearchParams(window.location.search);
    switch (mode) {
      case "index":
        params.delete("mode");
        break;
      case "wish":
        params.set("mode", "wish");
        break;
      case "bookmark":
        params.set("mode", "bookmark");
        break;
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const updateFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && !isNaN(Number(id))) {
        setDetailId(Number(id));
      }

      const mode = params.get("mode");
      if (mode === "wish" || mode === "bookmark") {
        setMode(mode);
        return;
      }

      setMode("index");
    };
    updateFromURL();
    window.addEventListener("popstate", updateFromURL);
    return () => {
      window.removeEventListener("popstate", updateFromURL);
    };
  }, [pathname]);

  if (!user || !mode) return null;

  if (isDrawerOpen) {
    return <SettingDrawer
      isOpen={isDrawerOpen}
      placement="bottom"
      zIndex={100}
      onClose={() => setIsDrawerOpen(false)}>
      <form
        className="mx-5 rounded-t-[15px] bg-white h-[80vh] p-5"
        onSubmit={handleSubmit(onSettingSubmit)}
      >
        <h1 className="w-full mx-auto py-[30px] text-[#000] font-medium text-2xl text-center border-b border-b-[#aaa]">
          アカウント設定
        </h1>
        <div className="my-[30px] w-full flex items-center flex-col justify-center gap-3">
          <div className="relative w-35 h-35 rounded-full overflow-hidden">
            <Image
              alt={user.name}
              src={iconPreview || user.iconImageUrl || "/default-aveter.svg"}
              fill
              className="object-cover"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleIconChange}
          />
          <button
            type="button"
            className="border border-black rounded-[100px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-[12px] text-black p-3">編集</span>
          </button>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <label htmlFor="userName" className="text-[#000] text-sm font-medium">
            ユーザー名
          </label>
          <div className="w-[90%] mx-auto flex items-center justify-between">
            {isEditingName ? (
              <input
                id="userName"
                type="text"
                autoFocus
                className="text-[#000] text-sm font-medium border border-gray rounded-md px-2 py-1 w-full mr-2 outline-none focus:border-primary"
                {...register("name", {
                  required: "ユーザー名は必須です",
                  maxLength: { value: 50, message: "50文字以内で入力してください" },
                })}
              />
            ) : (
              <p className="text-[#000] text-sm font-medium">{user.name}</p>
            )}
            <button
              type="button"
              className="border border-black rounded-[100px] shrink-0"
              onClick={() => setIsEditingName(!isEditingName)}
            >
              <span className="text-[12px] text-black p-3">
                {isEditingName ? "完了" : "編集"}
              </span>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white rounded-[15px] py-3 text-center font-medium text-sm mt-6 disabled:opacity-50"
          >
            {isSubmitting ? "保存中..." : "保存"}
          </button>
          <button className="w-full rounded-[100px] border border-black py-3" type="button" onClick={handleLogout}>
            <span className="text-sm text-black font-medium">ログアウト</span>
          </button>
          <button className="w-full py-3" type="button" onClick={handleAccountDelete}>
            <span className="text-sm text-[#ff0000] font-medium text-center w-full">アカウント削除</span>
          </button>
        </div>
      </form>
    </SettingDrawer>
  }

  return (
    <div className="px-5 relative">
      <div className="relative">
        <div className="w-full h-45.25 flex flex-col justify-between items-center">
          <div className="relative w-35 h-35 rounded-full overflow-hidden">
            <Image
              alt={user.name}
              src={user.iconImageUrl || "/default-aveter.svg"}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-6 font-medium">{user.name}</div>
        </div>
        <div className="absolute top-0 right-0" onClick={() => setIsDrawerOpen(true)}>
          <Icon name="setting" size={32} />
        </div>
      </div>
      <div className="h-7.75 p-1.5 mt-15 mb-8.5 text-gray border-t border-gray -mx-5">
        <div className="py-1.5 mb-1 flex gap-5 text-4 font-medium px-5">
          <button
            className={cn("pb-2", mode === "index" && "text-black border-b")}
            onClick={() => changeMode("index")}
          >
            投稿一覧
          </button>
          <button
            className={cn("pb-2", mode === "wish" && "text-black border-b")}
            onClick={() => changeMode("wish")}
          >
            やってみたい
          </button>
          <button
            className={cn("pb-2", mode === "bookmark" && "text-black border-b")}
            onClick={() => changeMode("bookmark")}
          >
            ブックマーク
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading[mode]
          ? Array.from({ length: 6 }).map((_, i) => (
            <BlogSideCardSkeleton key={`profile-skeleton-${i}`} />
          ))
          : blogs[mode].map((blog) => (
            <BlogSideCard
              id={blog.id}
              key={blog.id}
              title={blog.title}
              user={blog.user}
              thumbnailImageUrl={blog.thumbnailImageUrl}
              wishedCount={blog.wishesCount}
              bookmarkedCount={blog.bookmarksCount}
            />
          ))}
      </div>
    </div>
  );
}
