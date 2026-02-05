import { useErrorStore } from "@/stores/use-error-store";
import { cn } from "@/utils/cn";
import { forwardRef, useEffect, useState } from "react";
import { usePopover } from "./use-popover";
import { motion } from "framer-motion";
import { Icon } from "../icon/icon";
import { tagStore } from "@/lib/api/tag-store";
import { tagIndex } from "@/lib/api/tag-index";

type Props = {
  label?: string;
  icon?: React.ReactNode;

  // デフォルトのinputタグと同じ
  name?: string;
  value?: number[];
  onChange?: (v: number[]) => void;
  type?: "text" | "password" | "number";
  placeholder?: string;
};

export const TagInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, icon, name, type = "text", placeholder, value = [], onChange },
    ref,
  ) => {
    const { error } = useErrorStore(name);
    const { inputRef, wrapperRef, popoverRef, isOpen } = usePopover(ref, 160);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<{ value: number; label: string }[]>([]);
    const filteredTags = tags?.filter((t) => t.label.includes(search));

    useEffect(() => {
      tagIndex().then((res) =>
        setTags(
          res.data.map((t) => {
            return {
              value: t.id,
              label: t.name,
            };
          }),
        ),
      );
    }, []);

    useEffect(() => {
      if (value) setSearch("");
    }, [value]);

    return (
      <div>
        {label && <p className="pl-2 mb-2 font-medium">{label}</p>}
        <div ref={wrapperRef}>
          <label className="block">
            <div
              className={cn(
                "flex flex-col gap-2 p-4 border rounded-2xl focus-within:border-primary",
                error && "bg-error/20 border-error",
              )}
            >
              {value.length > 0 && (
                <div className="overflow-x-auto flex *:shrink-0 gap-2 no-scrollbar">
                  {tags
                    .filter((tag) => value.includes(tag.value))
                    .map((tag) => (
                      <div
                        className="flex items-center bg-base whitespace-nowrap rounded-lg overflow-hidden border border-gray"
                        key={tag.value}
                      >
                        <p className="pl-3 pr-2">{tag.label}</p>
                        <div
                          role="button"
                          className="h-full flex items-center p-2 hover:bg-error/50 hover:text-popover cursor-pointer"
                          onMouseDown={() => {
                            onChange?.(value.filter((v) => v !== tag.value));
                          }}
                        >
                          <Icon size={16} name="close" />
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <input
                ref={inputRef}
                className={cn(
                  "w-full outline-none [&::-webkit-inner-spin-button]:[-webkit-appearance:none] autofill:bg-transparent bg-clip-text text-[16px]",
                  value.length > 0 && "not-focus:absolute not-focus:w-0",
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => setSearch("")}
                type="text"
                placeholder={value.length > 0 ? "" : placeholder}
              // onFocus={() => {
              //   if (!inputRef.current) return;

              //   // 少し遅延させてキーボード表示後にスクロール
              //   setTimeout(() => {
              //     const rect = inputRef.current!.getBoundingClientRect();
              //     const scrollTop = window.scrollY + rect.top - 50; // top-50px
              //     window.scrollTo({ top: scrollTop, behavior: "smooth" });
              //   }, 100); // 100msぐらいが安定
              // }}
              />
              {icon && <div>{icon}</div>}
            </div>
          </label>

          {isOpen && (
            <motion.div
              ref={popoverRef}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={{
                initial: {
                  opacity: 0,
                  transform: "scale(0.8)",
                },
                enter: {
                  opacity: 1,
                  transform: "scale(1)",
                  transition: {
                    type: "spring",
                    bounce: 0,
                    duration: 0.3,
                  },
                },
                exit: {
                  opacity: 0,
                  transform: "scale(0.96)",
                  transition: {
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.15,
                  },
                },
              }}
              className="*:p-3 fixed! z-99 text-black p-2 rounded-2xl bg-base border border-base-hover overflow-y-auto shadow shadow-base-hover no-scrollbar"
            >
              {filteredTags?.length === 0 && (
                <p
                  className="flex items-center gap-2 hover:bg-base-hover rounded-lgs"
                  onClick={async () => {
                    const tempId = -Date.now();
                    const tagName = search;

                    // 楽観的更新
                    setTags((prev) => [
                      ...prev,
                      { value: tempId, label: tagName },
                    ]);
                    setSearch("");

                    const newValue = [...value, tempId];
                    onChange?.(newValue);

                    const res = await tagStore({ name: tagName });

                    if (res.status === "success") {
                      // 成功: tempIdを実際のIDに置き換え
                      setTags((prev) =>
                        prev.map((t) =>
                          t.value === tempId
                            ? { value: res.tagId, label: tagName }
                            : t,
                        ),
                      );
                      const updatedValue = newValue.map((v) =>
                        v === tempId ? res.tagId : v,
                      );
                      onChange?.(updatedValue);
                    } else {
                      // 失敗: ロールバック
                      setTags((prev) => prev.filter((t) => t.value !== tempId));
                      const rolledBackValue = value.filter((v) => v !== tempId);
                      onChange?.(rolledBackValue);
                    }
                  }}
                >
                  {search}
                </p>
              )}
              {filteredTags?.map((tag) => (
                <div
                  key={tag.value}
                  className="flex items-center gap-2 hover:bg-base-hover rounded-lg"
                  onClick={() => {
                    onChange?.(
                      value.includes(tag.value)
                        ? value.filter((v) => v !== tag.value)
                        : [...value, tag.value],
                    );
                  }}
                >
                  {value.includes(tag.value) && <Icon size={24} name="check" />}
                  {tag.label}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <p
          className={cn(
            "h-lh text-error text-xs leading-none ml-2 mt-1",
            !error && "opacity-0",
          )}
        >
          {error}
        </p>
      </div>
    );
  },
);
