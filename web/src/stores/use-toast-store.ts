import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  type: string;
};

type ToastState = {
  toasts: Toast[];
  // type は各プロジェクト側でラップして型安全に扱う前提の低レベル API
  addToast: (type: string, message: string) => void;
  stopTimer: () => void;
  startTimer: () => void;
};

// グローバルタイマーを管理
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleDismiss = (get: () => ToastState, set: (state: Partial<ToastState>) => void) => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
  dismissTimer = setTimeout(() => {
    const currentToasts = get().toasts;
    if (currentToasts.length > 0) {
      const newToasts = currentToasts.slice(0, -1);
      set({ toasts: newToasts });
      if (newToasts.length > 0) {
        scheduleDismiss(get, set);
      }
    }
  }, 3000);
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    scheduleDismiss(get, set);
  },

  stopTimer: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  },

  startTimer: () => {
    if (get().toasts.length > 0) {
      scheduleDismiss(get, set);
    }
  },
}));
