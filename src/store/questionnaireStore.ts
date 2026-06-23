import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IntroStepResponse } from "@/types/questionnaire";

interface QuestionnaireStoreState {
  introResponses: IntroStepResponse[];
  visitConsentState: { cartId: number; state: string } | null;
  // The intro step the user last viewed — lets the consent page's back button
  // resume the intro sub-flow where they left off instead of restarting it.
  lastIntroStep: string | null;
  // The consultation steps the user has traversed, per cart: an ordered path plus the
  // current position in it. Drives how far the progress bar sits across the questionnaire
  // band (see useVisitConsultation). Storing the path + pointer (not just a count) is what
  // lets the bar move BACKWARD when the user goes back, and re-answering mid-path drops the
  // now-stale forward branch. Reset when the cart changes.
  consultationSteps: { cartId: number; path: string[]; pos: number } | null;
  addIntroResponse: (response: IntroStepResponse) => void;
  clearIntroResponses: () => void;
  setVisitConsentState: (cartId: number, state: string) => void;
  setLastIntroStep: (slug: string) => void;
  markConsultationStep: (cartId: number, slug: string) => void;
  // Wipe all persisted questionnaire progress — used on logout so a new session
  // doesn't inherit the previous user's intro answers / consent state.
  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireStoreState>()(
  persist(
    (set) => ({
      introResponses: [],
      visitConsentState: null,
      lastIntroStep: null,
      consultationSteps: null,

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

      markConsultationStep: (cartId, slug) =>
        set((state) => {
          const cur = state.consultationSteps;
          // Guard the cart match AND a valid `path` — a pre-migration persisted value may
          // still carry the old `{ slugs }` shape with no `path`.
          const prev = cur && cur.cartId === cartId && Array.isArray(cur.path) ? cur : null;
          if (!prev) return { consultationSteps: { cartId, path: [slug], pos: 0 } };

          const known = prev.path.indexOf(slug);
          if (known !== -1) {
            // Revisiting a step we've seen (went back, or forward along the same path) —
            // just move the pointer so the bar tracks the real position both ways.
            return known === prev.pos ? {} : { consultationSteps: { ...prev, pos: known } };
          }
          // A new step follows the current one; drop any now-stale forward branch left
          // over from going back and answering differently.
          const path = [...prev.path.slice(0, prev.pos + 1), slug];
          return { consultationSteps: { cartId, path, pos: path.length - 1 } };
        }),

      reset: () =>
        set({
          introResponses: [],
          visitConsentState: null,
          lastIntroStep: null,
          consultationSteps: null,
        }),
    }),
    {
      name: "sildenafil-questionnaire",
      version: 1,
      // consultationSteps changed shape ({ slugs } → { path, pos }); drop any value persisted
      // under the old shape so the progress bar rehydrates from a clean, valid state.
      migrate: (persisted): QuestionnaireStoreState => {
        const state = persisted as QuestionnaireStoreState;
        return { ...state, consultationSteps: null };
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        introResponses: state.introResponses,
        visitConsentState: state.visitConsentState,
        lastIntroStep: state.lastIntroStep,
        consultationSteps: state.consultationSteps,
      }),
    },
  ),
);
