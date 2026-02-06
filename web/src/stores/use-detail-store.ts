import { create } from "zustand";

export type DetailId = number | null;

type DetailState = {
  detailId: DetailId;
  setDetailId: (id: DetailId) => void;
};

export const useDetailStore = create<DetailState>((set) => ({
  detailId: null,
  setDetailId: (id) => set({ detailId: id }),
}));
