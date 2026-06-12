import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartV2 } from "@/types/cart";

export interface ActiveCartEntry {
  cart: CartV2;
  variantLabel: string;
  redirectPath: string;
}

interface CartStoreState {
  activeCart: ActiveCartEntry | null;
  hasHydrated: boolean;
  setActiveCart: (entry: ActiveCartEntry | null) => void;
  clearActiveCart: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      activeCart: null,
      hasHydrated: false,

      setActiveCart: (entry) => set({ activeCart: entry }),
      clearActiveCart: () => set({ activeCart: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "sildenafil-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeCart: state.activeCart }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
