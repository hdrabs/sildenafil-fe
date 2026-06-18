import { useQuery, useMutation } from "@tanstack/react-query";
import { questionnaireService } from "@/api/services/questionnaireService";
import { questionnaireKeys, visitKeys } from "@/constants/queryKeys";
import {
  IntroStepParams,
  QuestionaireStepParams,
  QuestionairePayload,
  CartAuthParams,
  GoBackParams,
  VisitCreateRequest,
} from "@/types/questionnaire";

// ── Intro questions ───────────────────────────────────────────────────────────

export const useGetIntroStep = (params: IntroStepParams, enabled = true) =>
  useQuery({
    queryKey: questionnaireKeys.introStep(params.step_label, params.cart_id),
    queryFn: () => questionnaireService.getIntroStep(params),
    enabled,
    staleTime: 0,
  });

// ── Main questionnaire ────────────────────────────────────────────────────────

export const useGetQuestionaireStep = (params: QuestionaireStepParams, enabled = true) =>
  useQuery({
    queryKey: questionnaireKeys.step(params.step_label, params.cart_id),
    queryFn: () => questionnaireService.getStep(params),
    enabled,
    refetchOnWindowFocus: false,
  });

export const useSaveQuestionaireStep = () =>
  useMutation({
    mutationFn: (data: QuestionairePayload) => questionnaireService.saveStep(data),
  });

export const useGoBackQuestionaire = () =>
  useMutation({
    mutationFn: (params: GoBackParams) => questionnaireService.goBack(params),
  });

// ── Search ────────────────────────────────────────────────────────────────────

export const useSearchMedications = (
  name: string,
  cartAuth: CartAuthParams,
  enabled = true,
) =>
  useQuery({
    queryKey: questionnaireKeys.medications(name),
    queryFn: () => questionnaireService.searchMedications({ ...cartAuth, name }),
    enabled: enabled && name.length > 1,
  });

export const useSearchAllergies = (
  name: string,
  cartAuth: CartAuthParams,
  enabled = true,
) =>
  useQuery({
    queryKey: questionnaireKeys.allergies(name),
    queryFn: () => questionnaireService.searchAllergies({ ...cartAuth, name }),
    enabled: enabled && name.length > 1,
  });

// ── Visits ────────────────────────────────────────────────────────────────────

export const useCreateVisit = () =>
  useMutation({
    mutationFn: (data: VisitCreateRequest) => questionnaireService.createVisit(data),
  });

export const useGetEligibleStates = (enabled = true) =>
  useQuery({
    queryKey: visitKeys.eligibleStates(),
    queryFn: () => questionnaireService.getEligibleStates(),
    enabled,
  });

export const useGetVisitState = (cartId: number, cartToken?: string, enabled = true) =>
  useQuery({
    queryKey: ["visit_state", cartId],
    queryFn: () => questionnaireService.getVisitState(cartId, cartToken),
    enabled: enabled && cartId > 0,
    staleTime: 0,
  });

// ── Checkout step advancement ─────────────────────────────────────────────────

export const useAdvanceIntroQuestions = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.advanceIntroQuestions(params),
  });

export const useAdvancePatientInfo = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.advancePatientInfo(params),
  });

export const useAdvanceVisitIntro = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.advanceVisitIntro(params),
  });

export const useAdvanceVisitConsent = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.advanceVisitConsent(params),
  });

export const useAdvanceVisitConsultation = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.advanceVisitConsultation(params),
  });

export const useFinishNoCheckup = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.finishNoCheckup(params),
  });

export const useFinishNoBloodPressure = () =>
  useMutation({
    mutationFn: (params: CartAuthParams) =>
      questionnaireService.finishNoBloodPressure(params),
  });
