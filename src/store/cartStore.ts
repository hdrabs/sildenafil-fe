import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ActiveCartEntry, CartV2 } from "@/types/cart";

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
      // Persist only the fields the app actually reads off the cart: the restore
      // key (id/token) plus the cart-drawer + shipping fields. Everything else in
      // CartV2 is server-derived and never read from the persisted store, so it's
      // dropped to keep stale, internal data out of localStorage. For logged-in
      // users the full cart is refreshed from /active_cart on load (MainNav), so
      // this is just a fast-paint cache; for guest carts (which have no server
      // re-fetch endpoint) it's the only restore source — hence the read fields stay.
      partialize: (state) => ({
        activeCart: state.activeCart
          ? {
              cart: {
                id: state.activeCart.cart.id,
                token: state.activeCart.cart.token,
                final_price: state.activeCart.cart.final_price,
                quantity: state.activeCart.cart.quantity,
                visit_uuid: state.activeCart.cart.visit_uuid,
                delivery_type: state.activeCart.cart.delivery_type,
                shipping_address_id: state.activeCart.cart.shipping_address_id,
              } as CartV2,
              variantLabel: state.activeCart.variantLabel,
              redirectPath: state.activeCart.redirectPath,
            }
          : null,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
