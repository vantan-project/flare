import { useEffect, useRef, useState } from "react";
import { Icon } from "../icon/icon";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "motion/react";
import { TagIndexResponse } from "@/lib/api/tag-index";

type Props = {
  value: number[];
  onChange: (tags: number[]) => void;
  onSearch: () => void; // 検索ボタン
};

export function TagSelect({ value, onChange, onSearch }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagIndexResponse>([
    { id: 1, name: "読書" },
    { id: 2, name: "運動" },
    { id: 3, name: "ゲーム" },
    { id: 4, name: "プログラミング" },
    { id: 5, name: "料理" },
    { id: 6, name: "お菓子" },
    { id: 7, name: "音楽" },
    { id: 8, name: "写真" },
    { id: 9, name: "動画" },
    { id: 10, name: "映画" },
    { id: 11, name: "ネット" },
    { id: 12, name: "美容" },
    { id: 13, name: "健康" },
    { id: 14, name: "健康" },
    { id: 15, name: "健康" },
    { id: 16, name: "健康" },
    { id: 17, name: "健康" },
    { id: 18, name: "健康" },
    { id: 19, name: "健康" },
    { id: 20, name: "健康" },
    { id: 21, name: "健康" },
    { id: 22, name: "健康" },
    { id: 23, name: "健康" },
    { id: 24, name: "健康" },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const baseTags = tags.filter((tag) => tag.name.includes(search));
  const [selectedTags, notSelectedTags] = baseTags.reduce<
    [typeof baseTags, typeof baseTags]
  >(
    (acc, tag) => {
      acc[value.includes(tag.id) ? 0 : 1].push(tag);
      return acc;
    },
    [[], []],
  );

  return (
    <div className="relative w-28 text-xs">
      <div
        className="py-3 rounded-[20px] bg-white border border-black flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? "タグを選択" : `${value.length}個選択中`}
        <div className={cn(isOpen && "rotate-180")}>
          <Icon name="toggle" size={16} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-0 right-0 w-72 rounded-[20px] border border-black bg-base overflow-hidden"
            ref={popoverRef}
          >
            <div className="pt-3 px-3">
              <input
                className="p-2.5 rounded-[15px] bg-white border border-gray w-full"
                placeholder="検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="p-3 flex flex-wrap gap-2 overflow-y-auto h-56">
              {selectedTags.map(({ id, name }) => (
                <div
                  key={id}
                  onClick={() => {
                    onChange(value.filter((v) => v !== id));
                    setSearch("");
                  }}
                  className={cn(
                    "w-fit h-fit text-xs py-1.5 px-2.5 rounded-full border cursor-pointer",
                    "bg-primary-hover text-white border-primary",
                  )}
                >{`# ${name}`}</div>
              ))}
              {notSelectedTags.map(({ id, name }) => (
                <div
                  key={id}
                  onClick={() => {
                    onChange([...value, id]);
                    setSearch("");
                  }}
                  className={cn(
                    "w-fit h-fit text-xs py-1.5 px-2.5 rounded-full border cursor-pointer",
                    "bg-base text-black border-gray",
                  )}
                >{`# ${name}`}</div>
              ))}
              {baseTags.length === 0 && <div>タグがありません。</div>}
            </div>

            <div className="w-full py-3 px-2 border-t border-gray grid grid-cols-[1fr_2fr] gap-2">
              <button
                className="py-2 px-4.5 text-xs bg-base text-black border border-gray rounded-full cursor-pointer"
                type="button"
                onClick={() => onChange([])}
              >
                クリア
              </button>
              <button
                className="py-2 px-4.5 text-xs bg-primary-hover text-white border border-primary rounded-full cursor-pointer"
                type="button"
                onClick={() => {
                  onSearch();
                  setSearch("");
                  setIsOpen(false);
                }}
              >
                検索
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
