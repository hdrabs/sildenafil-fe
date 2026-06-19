import api from "@/api/baseAPI";
import {
  IntroStep,
  IntroStepParams,
  QuestionaireStep,
  QuestionaireStepParams,
  QuestionairePayload,
  CartAuthParams,
  GoBackParams,
  SearchParams,
  VisitConsentSubmissionRequest,
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

  goBack: (params: GoBackParams): Promise<QuestionaireStep> =>
    api.delete<QuestionaireStep>("/v2/questionaire", params),

  // ── Search (medications / allergies) ─────────────────────────────────────

  searchMedications: (params: SearchParams): Promise<MedicationResult[]> =>
    api
      .get<Record<string, unknown>[]>(`/v2/medications${buildCartQs(params)}`)
      .then((items) =>
        items.map((item) => ({
          ...item,
          id: item["DispensableDrugId"] ?? item["RoutedDoseFormDrugId"],
          name: (item["NameWithRouteDoseForm"] ?? item["Name"]) as string,
          strength: (item["Strength"] as string | null) ?? undefined,
        })),
      ),

  searchAllergies: (params: SearchParams): Promise<AllergyResult[]> =>
    api
      .get<Record<string, unknown>[]>(`/v2/allergies${buildCartQs(params)}`)
      .then((items) =>
        items.map((item) => ({
          ...item,
          id: item["AllergenId"],
          name: item["Name"] as string,
        })),
      ),

  // ── Visits ────────────────────────────────────────────────────────────────

  getEligibleStates: (): Promise<VisitEligibleStatesResponse> =>
    api.get<VisitEligibleStatesResponse>("/v2/visits"),

  getVisitState: (cartId: number, cartToken?: string): Promise<{ state: string | null; terms: boolean; state_ack: boolean }> =>
    api.get<{ state: string | null; terms: boolean; state_ack: boolean }>(
      `/v2/visits/${cartId}${buildCartQs({ cart_id: cartId, cart_token: cartToken })}`
    ),

  // ── Checkout step advancement ─────────────────────────────────────────────

  advanceIntroQuestions: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/intro_questions", params),

  advancePatientInfo: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/patient_info", params),

  advanceVisitIntro: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/visit_intro", params),

  // One call: creates the visit, saves buffered intro responses, advances the step.
  submitVisitConsent: (data: VisitConsentSubmissionRequest): Promise<CheckoutStepResponse> =>
    api.post<CheckoutStepResponse>("/v2/checkout/visit_consent_submission", data),

  advanceVisitConsultation: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/visit_consultation", params),

  finishNoCheckup: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/no_checkup", params),

  finishNoBloodPressure: (params: CartAuthParams): Promise<CheckoutStepResponse> =>
    api.put<CheckoutStepResponse>("/v2/checkout/no_blood_pressure", params),
};
