import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IntroStepResponse } from "@/types/questionnaire";

interface QuestionnaireStoreState {
  introResponses: IntroStepResponse[];
  introStepHistory: string[];
  visitConsentState: { cartId: number; state: string } | null;
  addIntroResponse: (response: IntroStepResponse) => void;
  clearIntroResponses: () => void;
  pushIntroStep: (slug: string) => void;
  popIntroStep: () => string | undefined;
  setVisitConsentState: (cartId: number, state: string) => void;
}

export const useQuestionnaireStore = create<QuestionnaireStoreState>()(
  persist(
    (set, get) => ({
      introResponses: [],
      introStepHistory: [],
      visitConsentState: null,

      addIntroResponse: (response) =>
        set((state) => ({
          introResponses: [
            ...state.introResponses.filter((r) => r.step_id !== response.step_id),
            response,
          ],
        })),

      clearIntroResponses: () => set({ introResponses: [], introStepHistory: [] }),

      setVisitConsentState: (cartId, state) => set({ visitConsentState: { cartId, state } }),

      pushIntroStep: (slug) =>
        set((state) => ({
          introStepHistory: [...state.introStepHistory.filter((s) => s !== slug), slug],
        })),

      popIntroStep: () => {
        const history = get().introStepHistory;
        if (history.length === 0) return undefined;
        const prev = history[history.length - 1];
        set({ introStepHistory: history.slice(0, -1) });
        return prev;
      },
    }),
    {
      name: "sildenafil-questionnaire",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        introResponses: state.introResponses,
        introStepHistory: state.introStepHistory,
        visitConsentState: state.visitConsentState,
      }),
    },
  ),
);
