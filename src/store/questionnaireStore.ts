import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IntroStepResponse } from "@/types/questionnaire";

interface QuestionnaireStoreState {
  introResponses: IntroStepResponse[];
  addIntroResponse: (response: IntroStepResponse) => void;
  clearIntroResponses: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireStoreState>()(
  persist(
    (set) => ({
      introResponses: [],

      addIntroResponse: (response) =>
        set((state) => ({
          introResponses: [
            ...state.introResponses.filter((r) => r.step_id !== response.step_id),
            response,
          ],
        })),

      clearIntroResponses: () => set({ introResponses: [] }),
    }),
    {
      name: "sildenafil-questionnaire",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ introResponses: state.introResponses }),
    },
  ),
);
