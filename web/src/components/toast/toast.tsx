import { useToastStore } from "@/stores/use-toast-store";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Icon } from "../icon/icon";

export interface ToastProps<T extends string> {
  placement?:
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"
    | "top-right"
    | "top-left"
    | "top-center";
  zIndex?: number;
}

export function Toast<T extends string>({
  placement = "bottom-right",
  zIndex = 50,
}: ToastProps<T>) {
  const { toasts, stopTimer, startTimer } = useToastStore();
  const [isHovered, setIsHovered] = useState(false);

  const getExit = () => {
    // left, rightを優先する
    if (placement.includes("right")) return { x: 100, opacity: 0 };
    if (placement.includes("left")) return { x: -100, opacity: 0 };
    if (placement.includes("top")) return { y: -50, opacity: 0 };
    if (placement.includes("bottom")) return { y: 50, opacity: 0 };
    return { opacity: 0 };
  };

  const toastClassName = (positionFromNewest: number) =>
    cn(
      "absolute",
      placement.includes("center") && "left-1/2 transform -translate-x-1/2",
      placement.includes("right") && "right-0",
      placement.includes("bottom") && "bottom-0",
      positionFromNewest === 0 && "z-1000",
      positionFromNewest === 1 &&
        cn("z-999 scale-95", placement.includes("top") ? "pt-2" : "pb-2"),
      positionFromNewest === 2 &&
        cn("z-998 scale-90", placement.includes("top") ? "pt-4" : "pb-4")
    );

  return (
    <div
      className={cn(
        "fixed z-50",
        placement.includes("top") && "top-2",
        placement.includes("bottom") && "bottom-2",
        placement.includes("left") && "left-2",
        placement.includes("right") && "right-2",
        placement.includes("center") && "left-1/2 -translate-x-1/2"
      )}
      style={{ zIndex }}
      onMouseEnter={() => {
        setIsHovered(true);
        stopTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startTimer();
      }}
    >
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => {
            // 最新3つだけ表示（古い方は非表示）
            if (index < toasts.length - 3) return null;

            const positionFromNewest = toasts.length - 1 - index;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={getExit()}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={
                  isHovered
                    ? "not-last:mb-2"
                    : toastClassName(positionFromNewest)
                }
                layout
              >
                <div
                  className={cn(
                    "p-3 w-82 bg-base border-l-2 flex items-center gap-3 rounded-lg shadow",
                    toast.type === "error" && "text-error",
                    toast.type === "success" && "text-success"
                  )}
                >
                  {(toast.type === "error" || toast.type === "success") && (
                    <Icon size={18} name={toast.type} />
                  )}
                  <p className="text-black">{toast.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
