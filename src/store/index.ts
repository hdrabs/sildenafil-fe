import { useShallow } from "zustand/react/shallow";
import { useUserStore } from "./userStore";

export const useUser = () => useUserStore((s) => s.user);
export const useIsAuthenticated = () => useUserStore((s) => !!s.user?.token);
export const useHasHydrated = () => useUserStore((s) => s.hasHydrated);
export const useSetUser = () => useUserStore((s) => s.setUser);
export const useUpdateUser = () => useUserStore((s) => s.updateUser);
export const useClearUser = () => useUserStore((s) => s.clearUser);
export const useAuthState = () =>
  useUserStore(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: !!s.user?.token,
      hasHydrated: s.hasHydrated,
      isLoading: s.isLoading,
    }))
  );
