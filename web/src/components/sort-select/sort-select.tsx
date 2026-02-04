import { useEffect, useRef, useState } from "react";
import { Icon } from "../icon/icon";
import { motion, AnimatePresence } from "framer-motion";

export type SortSelectProps<T extends string> = {
  value: null | T;
  options: {
    value: T;
    label: string;
    onClick: () => void; // 選択した時
  }[];
};

export function SortSelect<T extends string>({
  value,
  options,
}: SortSelectProps<T>) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative w-28 text-xs">
      <div
        className="py-3 rounded-[20px] bg-white border border-black flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon name="sort" size={16} />
        {value
          ? options.find((option) => option.value === value)?.label
          : "並び替え"}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-full top-0 left-0 rounded-[20px] border border-black bg-white overflow-hidden cursor-pointer"
            ref={popoverRef}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="flex justify-center items-center py-2 hover:bg-base-hover not-last:border-b border-black"
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
