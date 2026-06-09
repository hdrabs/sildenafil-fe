import { User, UserState } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      hasHydrated: false,

      // Actions
      setUser: (user: User) => {
        set({
          user,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        set((state) => {
          if (state.user) {
            return {
              user: { ...state.user, ...updates },
            };
          }
          return state;
        });
      },

      clearUser: () => {
        set({
          user: null,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },
    }),
    {
      name: "sildenafil-user-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        // Only persist user data, not loading states or functions
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when rehydration is complete
        state?.setHasHydrated(true);
      },
    },
  ),
);
