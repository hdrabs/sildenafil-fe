import { AnswerOption } from "@/types/questionnaire";

/**
 * Some options require the patient to explain their answer in a free-text box
 * before Continue unlocks — e.g. q_7_01's "Yes, but there were issues" or the
 * side-effect "Yes" gates on the q_6_02_XX treatment steps. The questionnaire
 * data flags these with `allow_text` (same flag AUM gated on). The label match
 * is a fallback for question sets seeded before the flag was restored in
 * pocket_med's ed_questionaire_v2.json.
 */
export const answerOptionRequiresText = (option: AnswerOption): boolean =>
  !!option.allow_text || option.label.trim().toLowerCase() === "yes, but there were issues";
