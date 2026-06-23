import { useShallow } from "zustand/react/shallow";
import { useUserStore } from "./userStore";
import { useCartStore } from "./cartStore";
import { useQuestionnaireStore } from "./questionnaireStore";

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

export const useActiveCart = () => useCartStore((s) => s.activeCart);
export const useCartToken = () => useCartStore((s) => s.activeCart?.cart.token ?? null);
export const useSetActiveCart = () => useCartStore((s) => s.setActiveCart);
export const useClearActiveCart = () => useCartStore((s) => s.clearActiveCart);

export const useIntroResponses = () => useQuestionnaireStore((s) => s.introResponses);
export const useAddIntroResponse = () => useQuestionnaireStore((s) => s.addIntroResponse);
export const useClearIntroResponses = () => useQuestionnaireStore((s) => s.clearIntroResponses);
export const useVisitConsentState = () => useQuestionnaireStore((s) => s.visitConsentState);
export const useSetVisitConsentState = () => useQuestionnaireStore((s) => s.setVisitConsentState);
export const useLastIntroStep = () => useQuestionnaireStore((s) => s.lastIntroStep);
export const useSetLastIntroStep = () => useQuestionnaireStore((s) => s.setLastIntroStep);
export const useConsultationSteps = () => useQuestionnaireStore((s) => s.consultationSteps);
export const useMarkConsultationStep = () => useQuestionnaireStore((s) => s.markConsultationStep);
