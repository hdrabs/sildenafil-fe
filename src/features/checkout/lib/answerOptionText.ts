import { AnswerOption, Question } from "@/types/questionnaire";

/**
 * Some radio options require the patient to explain their answer in a free-text
 * box before Continue unlocks — e.g. q_7_01's "Yes, but there were issues",
 * where the clinician needs the detail. AUM gated Continue on this comment and
 * we mirror it. The PocketMed payload carries no machine flag for this, so we
 * match the known option label — the same approach as the "Other" checkbox.
 */
export const answerOptionRequiresText = (option: AnswerOption): boolean =>
  option.label.trim().toLowerCase() === "yes, but there were issues";

/**
 * A radio question that has a text-requiring option. Such a step must NOT
 * auto-advance on tap (the patient still has to fill in the box and press
 * Continue), so it's excluded from the single-radio auto-advance path.
 */
export const questionHasTextRequiredOption = (question: Question): boolean =>
  question.question_type === "radio" &&
  question.answer_options.some(answerOptionRequiresText);
