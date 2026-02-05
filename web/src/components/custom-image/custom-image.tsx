import { useState } from "react";
import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "300px",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});

export const ResizableImage = (props: NodeViewProps) => {
  const { node, updateAttributes, selected } = props;
  const [resizing, setResizing] = useState(false);

  // マウスとタッチの両方の座標取得を共通化
  const getClientX = (
    event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    if ("touches" in event) {
      return event.touches[0].clientX;
    }
    return (event as MouseEvent | React.MouseEvent).clientX;
  };

  const handleResize =
    (direction: "left" | "right") =>
    (event: React.MouseEvent | React.TouchEvent) => {
      // モバイルでスクロールを防止
      if (event.cancelable) event.preventDefault();

      setResizing(true);
      const startX = getClientX(event);
      const startWidth = parseInt(node.attrs.width, 10) || 300;

      const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientX
            : moveEvent.clientX;
        const diff =
          direction === "right" ? currentX - startX : startX - currentX;
        const newWidth = Math.max(100, startWidth + diff);
        updateAttributes({ width: `${newWidth}px` });
      };

      const onEnd = () => {
        setResizing(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    };

  return (
    <NodeViewWrapper
      as="span"
      className="relative inline-block leading-[0] m-1 transition-all"
    >
      <div
        className={`relative inline-block group ${selected || resizing ? "ring-2 ring-blue-500" : ""}`}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          style={{ width: node.attrs.width, height: "auto" }}
          className="inline-block max-w-full pointer-events-none" // pointer-events-noneで画像長押し保存と干渉を防ぐ
        />

        {/* 左リサイズバー - タッチしやすいようw-4に拡大 */}
        <div
          onMouseDown={handleResize("left")}
          onTouchStart={handleResize("left")}
          className={`absolute inset-y-0 left-0 w-4 -ml-2 z-10 cursor-col-resize group-hover:bg-blue-500/20 transition-colors ${
            selected ? "bg-primary/40" : "bg-transparent"
          }`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-500 rounded-full shadow-sm" />
        </div>

        {/* 右リサイズバー - タッチしやすいようw-4に拡大 */}
        <div
          onMouseDown={handleResize("right")}
          onTouchStart={handleResize("right")}
          className={`absolute inset-y-0 right-0 w-4 -mr-2 z-10 cursor-col-resize group-hover:bg-blue-500/20 transition-colors ${
            selected ? "bg-primary/40" : "bg-transparent"
          }`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-500 rounded-full shadow-sm" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
