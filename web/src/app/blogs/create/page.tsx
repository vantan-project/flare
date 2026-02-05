"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, useEffect } from "react";
import { imageStore } from "@/lib/api/image-store";
import { useToastStore } from "@/stores/use-toast-store";
import { Input } from "@/components/input/input";
import { TagInput } from "@/components/tag-input/tag-input";
import { useForm } from "react-hook-form";
import { blogStore, BlogStoreRequest } from "@/lib/api/blog-store";
import { Icon } from "@/components/icon/icon";
import { CustomImage } from "@/components/custom-image/custom-image";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useErrorStore } from "@/stores/use-error-store";
import { cn } from "@/utils/cn";

export default function ImageEditor() {
  const router = useRouter();
  const { setErrors } = useErrorStore();
  const { addToast } = useToastStore();
  const editerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, setValue, watch } =
    useForm<BlogStoreRequest>();
  const tagIds = watch("tagIds", []);
  const { error: imageError, setError: setImageError } =
    useErrorStore("thumbnailImageId");
  const { error: contentError, setError: setContentError } =
    useErrorStore("content");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage.configure({
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose max-w-none focus:outline-none min-h-[480px]! p-2 border rounded-2xl",
          contentError && "border-error bg-error/20",
        ),
      },
    },
  });

  const onSubmit = (values: BlogStoreRequest) => {
    if (!editor) return;

    // 2. Markdownの代わりに getJSON() を使用
    const jsonContent = editor.getJSON();

    const requestData = {
      title: values.title,
      tagIds: values.tagIds || [],
      thumbnailImageId: values.thumbnailImageId || 0,
      // 3. APIに送る際は文字列化して渡す（バックエンドの期待値に合わせて調整してください）
      content: JSON.stringify(jsonContent),
    };

    blogStore(requestData).then((res) => {
      switch (res.status) {
        case "success":
          addToast("success", res.message);
          router.push(`/?blogId=${res.blogId}`);
          break;
        case "error":
          addToast("error", res.message);
          break;
        case "validation":
          setErrors(res.fieldErrors);
          break;
      }
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const checkFocus = () => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) {
        setIsFocused(false);
        return;
      }

      setIsFocused(
        el.classList.contains("ProseMirror") || el.classList.contains("tiptap"),
      );
    };
    document.addEventListener("focusin", checkFocus);
    document.addEventListener("focusout", checkFocus);
    return () => {
      document.removeEventListener("focusin", checkFocus);
      document.removeEventListener("focusout", checkFocus);
    };
  }, []);

  useEffect(() => {
    if (isFocused && contentError) setContentError("content", "");
  }, [isFocused]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    imageStore({ image: file })
      .then((res) => {
        if (res.status === "success") {
          editor.chain().focus().setImage({ src: res.imageUrl }).run();
        }
      })
      .catch(() => addToast("error", "アップロード失敗"))
      .finally(() => (e.target.value = ""));
  };

  if (!editor) return null;

  return (
    <div className="px-4 flex flex-col gap-8">
      <div>
        <p className="mb-2 font-medium">サムネイル</p>
        <label
          htmlFor="image"
          className={cn(
            "flex relative items-center justify-center bg-base-hover rounded-[20px] overflow-hidden aspect-5/3 text-gray outline-4 outline-gray outline-dotted",
            imageError && "bg-error/20 outline-error",
          )}
        >
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="サムネイル"
              fill
              className="object-cover"
            />
          ) : (
            <Icon name="image" size={56} />
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (imageError) setImageError("thumbnailImageId", "");
              const file = e.target.files?.[0];
              if (!file) return;
              setFile(file);
              imageStore({ image: file }).then((res) => {
                if (res.status === "success") {
                  setValue("thumbnailImageId", res.imageId);
                  return;
                }

                addToast("error", "画像アップロードに失敗しました。");
                setFile(null);
              });
            }}
          />
        </label>
        <p
          className={cn(
            "h-lh text-error text-xs leading-none ml-2 mt-2",
            !imageError && "opacity-0",
          )}
        >
          {imageError}
        </p>
      </div>

      <Input
        label="タイトル"
        placeholder="タイトルを入力してください"
        {...register("title")}
      />

      <TagInput
        label="タグ"
        placeholder="タグを入力してください"
        {...register("tagIds")}
        value={tagIds}
        onChange={(v) => setValue("tagIds", v)}
      />

      <div className="pr-6 mb-12">
        <p className="pl-2 mb-2 font-medium">内容</p>
        <EditorContent ref={editerRef} editor={editor} />
        <p
          className={cn(
            "h-lh text-error text-xs leading-none ml-2 mt-2",
            !contentError && "opacity-0",
          )}
        >
          {contentError}
        </p>
      </div>

      <button
        className="fixed left-1/2 -translate-x-1/2 bottom-20 bg-primary p-3 px-8 rounded-2xl text-white font-medium"
        type="button"
        onClick={handleSubmit(onSubmit)}
      >
        投稿
      </button>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="fixed bottom-24 right-2 flex flex-col gap-2"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 bg-base hover:bg-base-hover text-black rounded-full shadow flex justify-center items-center border border-gray"
              type="button"
            >
              <Icon name="image" size={24} />
            </button>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="w-12 h-12 bg-base hover:bg-base-hover text-black rounded-full shadow flex justify-center items-center border border-gray"
              type="button"
            >
              <Icon name="h1" size={24} />
            </button>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="w-12 h-12 bg-base hover:bg-base-hover text-black rounded-full shadow flex justify-center items-center border border-gray"
              type="button"
            >
              <Icon name="h2" size={24} />
            </button>

            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="w-12 h-12 bg-base hover:bg-base-hover text-black rounded-full shadow flex justify-center items-center border border-gray"
              type="button"
            >
              <Icon name="h3" size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
