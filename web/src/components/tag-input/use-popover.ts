import { useEffect, useImperativeHandle, useRef, useState } from "react";

export function usePopover(
  ref: React.Ref<HTMLInputElement> | undefined,
  popoverHeight: number,
) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => inputRef.current!, [ref]);

  const handleOpen = () => {
    inputRef.current?.focus();
    setIsOpen(true);
  };
  const handleClose = () => {
    inputRef.current?.blur();
    setIsOpen(false);
  };

  const updatePopoverPosition = () => {
    if (!popoverRef.current || !wrapperRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const style = popoverRef.current.style;

    // visualViewport を考慮した位置計算
    const viewport = window.visualViewport;
    const viewportOffsetTop = viewport ? viewport.offsetTop : 0;
    const viewportOffsetLeft = viewport ? viewport.offsetLeft : 0;
    const viewportHeight = viewport ? viewport.height : window.innerHeight;

    // wrapperの下端位置（visualViewportのoffsetを考慮）
    const popoverTop = wrapperRect.bottom + viewportOffsetTop + 8;
    const popoverLeft = wrapperRect.left + viewportOffsetLeft;

    // キーボードが出ている場合、visualViewportの範囲内に収める
    const availableSpace = viewportHeight - (wrapperRect.bottom + 8);
    const adjustedMaxHeight = Math.min(
      popoverHeight,
      Math.max(0, availableSpace),
    );

    style.top = `${popoverTop}px`;
    style.left = `${popoverLeft}px`;
    style.width = `${wrapperRect.width}px`;
    style.maxHeight = `${adjustedMaxHeight}px`;
  };

  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;

    updatePopoverPosition();

    const observer = new ResizeObserver(updatePopoverPosition);
    observer.observe(wrapperRef.current);

    // requestAnimationFrameで確実に更新
    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updatePopoverPosition();
        rafId = null;
      });
    };

    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    // モバイルキーボード対応: visualViewport の変化を監視
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleUpdate);
      window.visualViewport.addEventListener("scroll", scheduleUpdate);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", scheduleUpdate);
        window.visualViewport.removeEventListener("scroll", scheduleUpdate);
      }
    };
  }, [isOpen, popoverHeight]);

  // クリックイベント
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const target = e.target as Node;
      if (inputRef.current?.contains(target)) {
        handleOpen();
        return;
      }
      if (wrapperRef.current.contains(target)) {
        e.preventDefault();
        handleOpen();
        return;
      }
      handleClose();
    };
    document.addEventListener("mousedown", handlePointerDown, true);
    return () =>
      document.removeEventListener("mousedown", handlePointerDown, true);
  }, []);

  // popover内のスクロールイベント
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;
    const el = popoverRef.current;
    let startY = 0;
    const handleWheel = (e: WheelEvent) => {
      if (!el.contains(e.target as Node)) return;
      const delta = e.deltaY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        e.preventDefault();
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      if (!el.contains(e.target as Node) || !e.touches[0]) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!el.contains(e.target as Node) || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const delta = startY - currentY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

  // クリック, スクロール時に閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      const target = e.target;
      if (!target) return;
      if (!(target instanceof Node)) return;
      if (wrapperRef.current?.contains(target)) {
        return;
      }
      handleClose();
    };
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  return {
    isOpen,
    handleOpen,
    handleClose,
    inputRef,
    wrapperRef,
    popoverRef,
  };
}
