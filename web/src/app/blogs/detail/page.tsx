"use client";

import { blogShow, BlogShowResponse } from "@/lib/api/blog-show";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { PreviewImage } from "@/components/preview-image/preview-image";
import { useRouter } from "next/navigation";
import { WishButton } from "@/components/buttons/wish-button";
import { BookmarkButton } from "@/components/buttons/bookmark-button";
import { WishLabelButton } from "@/components/buttons/wish-label-button";
import { BookmarkLabelButton } from "@/components/buttons/bookmark-label-button";

export default function () {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogShowResponse | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      PreviewImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blogIdParam = params.get("blogId");
    if (blogIdParam) {
      const id = Number(blogIdParam);
      if (!isNaN(id) && id > 0) {
        blogShow(id).then((res) => {
          setBlog(res.data);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (editor && blog?.content) {
      try {
        const jsonContent = JSON.parse(blog.content);
        editor.commands.setContent(jsonContent);
      } catch (e) {
        editor.commands.setContent(blog.content);
      }
    }
  }, [editor, blog?.content]);

  if (!blog) return null;

  return (
    <div className="h-screen w-screen bg-base flex flex-col -mt-8">
      <div className="relative aspect-12/7">
        <Image
          src={blog.thumbnailImageUrl}
          alt="画像なし"
          fill
          className="object-cover"
        />
      </div>

      <div className="py-4 px-5 flex flex-col gap-6 pb-28">
        <div>
          <h2 className="text-2xl font-medium">{blog.title}</h2>
          <p>{blog.updatedAt}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              className="px-3 py-1 bg-primary-hover text-white rounded-full text-sm cursor-pointer"
              onClick={() => {
                const json = encodeURIComponent(JSON.stringify([tag.id]));
                router.push(`/blogs?tagIds=${json}`);
              }}
            >
              {"# "}
              {tag.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-2 items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={blog.user.userIconUrl || "/default-aveter.svg"}
                alt="画像なし"
                fill
                className="object-cover"
              />
            </div>
            {blog.user.name}
          </div>

          <div className="flex gap-2">
            <WishButton id={blog.id} wishedCount={blog.wishesCount} />
            <BookmarkButton
              id={blog.id}
              bookmarkedCount={blog.bookmarksCount}
            />
          </div>
        </div>

        <EditorContent editor={editor} />

        <div className="px-4 border border-gray p-4 rounded-lg">
          <div className="flex gap-2 items-center mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={blog.user.userIconUrl || "/default-aveter.svg"}
                alt="画像なし"
                fill
                className="object-cover"
              />
            </div>
            {blog.user.name}
          </div>
          <div className="flex justify-between">
            <WishLabelButton id={blog.id} />
            <BookmarkLabelButton id={blog.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
