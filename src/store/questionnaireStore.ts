import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IntroStepResponse } from "@/types/questionnaire";

interface QuestionnaireStoreState {
  introResponses: IntroStepResponse[];
  visitConsentState: { cartId: number; state: string } | null;
  // The intro step the user last viewed — lets the consent page's back button
  // resume the intro sub-flow where they left off instead of restarting it.
  lastIntroStep: string | null;
  addIntroResponse: (response: IntroStepResponse) => void;
  clearIntroResponses: () => void;
  setVisitConsentState: (cartId: number, state: string) => void;
  setLastIntroStep: (slug: string) => void;
}

export const useQuestionnaireStore = create<QuestionnaireStoreState>()(
  persist(
    (set) => ({
      introResponses: [],
      visitConsentState: null,
      lastIntroStep: null,

      addIntroResponse: (response) =>
        set((state) => ({
          introResponses: [
            ...state.introResponses.filter((r) => r.step_id !== response.step_id),
            response,
          ],
        })),

      clearIntroResponses: () => set({ introResponses: [] }),

      setVisitConsentState: (cartId, state) => set({ visitConsentState: { cartId, state } }),

      setLastIntroStep: (slug) => set({ lastIntroStep: slug }),
    }),
    {
      name: "sildenafil-questionnaire",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        introResponses: state.introResponses,
        visitConsentState: state.visitConsentState,
        lastIntroStep: state.lastIntroStep,
      }),
    },
  ),
);
