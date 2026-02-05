"use client";
import { useEffect, useState } from "react";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Modal({ isOpen = false, onClose, children }: ModalProps) {
  const [modalIsOpen, setIsOpen] = useState(isOpen);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalIsOpen]);

  if (!modalIsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        setIsOpen(false);
        onClose?.();
      }}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
