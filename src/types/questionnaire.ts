import { CartV2 } from "@/types/cart";

export type QuestionType =
  | "radio"
  | "multi"
  | "text"
  | "textfield"
  | "textfield_disabled"
  | "dropdown"
  | "medication_search"
  | "allergy_search"
  | "statement"
  | "blood_pressure";

export type RejectionType = "no_checkup" | "no_blood_pressure";

export interface AnswerOption {
  id: number;
  label: string;
  extra_label: string | null;
  position: number;
  gender: "both" | "male" | "female";
  solo: boolean;
  /** This option requires a free-text explanation before Continue unlocks. */
  allow_text?: boolean;
  disqualify: boolean;
  next_step_label: string | null;
  /**
   * Backend-resolved: the intro step to navigate to when this answer is chosen,
   * or null when choosing it ends the intro flow (advance the cart). The FE no
   * longer needs to know PocketMed's "ed_"/"q_" label convention.
   */
  next_intro_step: string | null;
  immediate_step: { id: number; label: string; intro: boolean } | null;
  is_medication: boolean;
}

export interface Question {
  id: number;
  text: string;
  subtitle: string | null;
  label: string;
  position: number;
  question_type: QuestionType;
  answer_options: AnswerOption[];
}

export interface IntroStep {
  id: number;
  label: string;
  button_text: string;
  intro: boolean;
  questions: Question[];
  responses: Record<string, ResponseShape> | null;
}

export interface AnswerResponseEntry {
  answer_option_id: number;
  position: number;
  solo?: boolean;
  disqualify?: boolean;
  metadata?: {
    text?: string;
    height?: { feet: number; inches: number };
    weight?: string;
    result?: number;
    medication_search?: MedItem[];
    allergy_search?: unknown[];
    medication_option?: Record<string, unknown>;
  };
}

export type ResponseShape = {
  question_id: number;
  position: number;
} & Record<string, AnswerResponseEntry>;

export interface QuestionaireStep {
  id: number;
  label: string;
  button_text: string;
  disqualify: boolean;
  completed: boolean;
  rejection_type: RejectionType | null;
  responses: Record<string, ResponseShape> | null;
  questions: Question[];
}

export interface IntroStepResponse {
  step_id: number;
  responses: Record<string, ResponseShape>;
}

export interface QuestionairePayload {
  cart_id: number;
  cart_token?: string;
  responses: Record<string, ResponseShape>;
}

export interface CartAuthParams {
  cart_id: number;
  cart_token?: string;
}

export interface GoBackParams extends CartAuthParams {
  step_label?: string;
}

export interface IntroStepParams extends CartAuthParams {
  step_label: string;
}

export interface QuestionaireStepParams extends CartAuthParams {
  step_label: string;
}

export interface SearchParams extends CartAuthParams {
  name: string;
}

export interface VisitConsentSubmissionRequest {
  cart_id: number;
  cart_token?: string;
  visit: {
    state: string;
    terms: boolean;
    state_ack: boolean;
  };
  /** Intro answers buffered client-side before the visit existed; persisted server-side here. */
  intro_responses: { responses: Record<string, ResponseShape> }[];
}

export interface CheckoutStepResponse {
  cart: CartV2;
  redirect_path: string;
}

export interface MedItem {
  id: string | number;
  name: string;
  strength?: string;
  duration?: string;
  condition?: string;
}

export interface MedicationResult {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface AllergyResult {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export type QuestionaireReducerAction =
  | { type: "SET_INITIAL"; payload: Record<string, ResponseShape> | null }
  | {
      type: "SELECT_ANSWER";
      payload: {
        answerOption: AnswerOption;
        question: Question;
        metadata?: AnswerResponseEntry["metadata"];
      };
    }
  | {
      type: "DESELECT_ANSWER";
      payload: {
        answerOption: AnswerOption;
        question: Question;
      };
    };

export interface QuestionaireReducerState {
  questions: Record<string, ResponseShape>;
  hasInteracted: boolean;
}
