import { cn } from "@/utils/cn";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  placement: "top" | "bottom" | "left" | "right";
  zIndex?: number;
  onClose?: () => void;
}

export function SettingDrawer({
  isOpen,
  placement,
  zIndex = 40,
  children,
  onClose,
}: DrawerProps) {
  if (!isOpen) return null;

  const key = placement === "top" || placement === "bottom" ? "y" : "x";
  const variants = {
    enter: {
      [key]: 0,
      opacity: 1,
      transition: {
        [key]: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        },
        opacity: {
          duration: 0.3,
        }
      },
    },
    exit: {
      [key]: placement === "top" || placement === "left" ? "-100%" : "100%",
      opacity: 0,
      transition: {
        [key]: {
          duration: 0.3,
          ease: [0.4, 0, 0.6, 1],
        },
        opacity: {
          duration: 0.2,
        }
      },
    },
  } as Variants;

  const positions = {
    top: "justify-start",
    bottom: "justify-end",
    left: "items-start",
    right: "items-end",
  };

  return (
    <AnimatePresence>
      <motion.div
        className={cn("fixed inset-0 flex flex-col", positions[placement])}
        style={{ zIndex }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 bg-black opacity-70"
          onClick={onClose}
        />
        <motion.div
          className={cn(
            "relative",
            placement === "top" || placement === "bottom" ? "w-full" : "h-full",
          )}
          variants={variants}
          initial="exit"
          animate="enter"
          exit="exit"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}