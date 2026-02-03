import { create } from "zustand";

type ErrorState = {
  errors: Record<string, string>;
  setError: (key: string, message: string) => void;
  setErrors: (messages: Record<string, string>) => void;
};

export const _useErrorStore = create<ErrorState>((set, get) => ({
  errors: {},

  setError: (key, message) => {
    const currentValue = get().errors[key] ?? "";
    if (currentValue === message) return;
    if (message === "") {
      set((state) => {
        const { [key]: _, ...rest } = state.errors;
        return { errors: rest };
      });
    } else {
      set((state) => ({
        errors: {
          ...state.errors,
          [key]: message,
        },
      }));
    }
  },

  setErrors: (messages) => {
    set({ errors: { ...messages } });
  },
}));

export const useErrorStore = (id?: string) => {
  const error = _useErrorStore((s) => (id ? (s.errors[id] ?? "") : ""));
  const setError = _useErrorStore((s) => s.setError);
  const setErrors = _useErrorStore((s) => s.setErrors);

  return { error, setError, setErrors };
};
