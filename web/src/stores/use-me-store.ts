import { AuthMeResponse } from "@/lib/api/auth-me";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface MeStore {
  me: AuthMeResponse | null;
  setMe: (me: AuthMeResponse | null) => void;

  addWish: (id: number) => void;
  removeWish: (id: number) => void;

  addBookmark: (id: number) => void;
  removeBookmark: (id: number) => void;
}

export const useMeStore = create<MeStore>((set, get) => ({
  me: null,

  setMe: (me) => set({ me }),

  addWish: (id) => {
    const me = get().me;
    if (!me) return;

    if (me.wishedIds.includes(id)) return;

    set({
      me: {
        ...me,
        wishedIds: [...me.wishedIds, id],
      },
    });
  },

  removeWish: (id) => {
    const me = get().me;
    if (!me) return;

    set({
      me: {
        ...me,
        wishedIds: me.wishedIds.filter((v) => v !== id),
      },
    });
  },

  addBookmark: (id) => {
    const me = get().me;
    if (!me) return;

    if (me.bookmarkedIds.includes(id)) return;

    set({
      me: {
        ...me,
        bookmarkedIds: [...me.bookmarkedIds, id],
      },
    });
  },

  removeBookmark: (id) => {
    const me = get().me;
    if (!me) return;

    set({
      me: {
        ...me,
        bookmarkedIds: me.bookmarkedIds.filter((v) => v !== id),
      },
    });
  },
}));

export const useMeFavorites = () => {
  return useMeStore(
    useShallow((state) => ({
      wishedIds: state.me?.wishedIds ?? [],
      bookmarkedIds: state.me?.bookmarkedIds ?? [],
    }))
  );
};

export const useIsWished = (id?: number) => {
  return useMeStore((state) => {
    if (!id || !state.me) return false;
    return state.me.wishedIds.includes(id);
  });
};

export const useIsBookmarked = (id?: number) => {
  return useMeStore((state) => {
    if (!id || !state.me) return false;
    return state.me.bookmarkedIds.includes(id);
  });
};
