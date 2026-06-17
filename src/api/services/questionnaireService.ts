import api from "@/api/baseAPI";
import {
  IntroStep,
  IntroStepParams,
  QuestionaireStep,
  QuestionaireStepParams,
  QuestionairePayload,
  CartAuthParams,
  SearchParams,
  VisitCreateRequest,
  VisitResponse,
  CheckoutStepResponse,
  MedicationResult,
  AllergyResult,
} from "@/types/questionnaire";
import { VisitEligibleStatesResponse } from "@/types/visit";

const buildCartQs = (params: object): string => {
  const entries = (Object.entries(params) as [string, unknown][]).filter(
    (entry): entry is [string, string | number] =>
      entry[1] !== undefined && entry[1] !== null,
  );
  return entries.length
    ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`
    : "";
};

export const questionnaireService = {
  // ── Intro questions (no auth, no visit required) ─────────────────────────

  getIntroStep: (params: IntroStepParams): Promise<IntroStep> =>
    api.get<IntroStep>(`/v2/intro_questions${buildCartQs(params)}`),

  // ── Main questionnaire (cart + visit auth required) ──────────────────────

  getStep: (params: QuestionaireStepParams): Promise<QuestionaireStep> =>
    api.get<QuestionaireStep>(`/v2/questionaire${buildCartQs(params)}`),

  saveStep: (data: QuestionairePayload): Promise<QuestionaireStep> =>
    api.post<QuestionaireStep>("/v2/questionaire", data),

  goBack: (params: CartAuthParams): Promise<QuestionaireStep> =>
    api.delete<QuestionaireStep>(`/v2/questionaire${buildCartQs(params)}`),

  // ── Search (medications / allergies) ─────────────────────────────────────

  searchMedications: (params: SearchParams): Promise<MedicationResult[]> =>
    api.get<MedicationResult[]>(`/v2/medications${buildCartQs(params)}`),

  searchAllergies: (params: SearchParams): Promise<AllergyResult[]> =>
    api.get<AllergyResult[]>(`/v2/allergies${buildCartQs(params)}`),

  // ── Visits ────────────────────────────────────────────────────────────────

  createVisit: (data: VisitCreateRequest): Promise<VisitResponse> =>
    api.post<VisitResponse>("/v2/visits", data),

  getEligibleStates: (): Promise<VisitEligibleStatesResponse> =>
    api.get<VisitEligibleStatesResponse>("/v2/visits"),

  // ── Checkout step advancement ─────────────────────────────────────────────

  advanceIntroQuestions: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/intro_questions", params),

  advancePatientInfo: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/patient_info", params),

  advanceVisitIntro: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/visit_intro", params),

  advanceVisitConsent: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/visit_consent", params),

  advanceVisitConsultation: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/visit_consultation", params),
};
