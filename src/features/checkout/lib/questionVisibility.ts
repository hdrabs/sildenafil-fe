import { Question, ResponseShape } from "@/types/questionnaire";

/**
 * Whether a question on a grouped step should be shown (and therefore required).
 *
 * A `multi` question that immediately follows a Yes/No radio is a conditional
 * follow-up — e.g. "Which side effects did you experience?" after "Did you
 * experience any side effects?". It only applies when the gate is answered
 * "Yes"; when it's "No" the follow-up is hidden AND must not be required, or the
 * Continue button can never enable.
 *
 * Both the renderer (hide it) and the Continue gate (don't require it) must use
 * this single rule or they disagree and the page locks.
 */
export const isQuestionVisible = (
  questions: Question[],
  index: number,
  responses: Record<string, ResponseShape>,
): boolean => {
  const question = questions[index];
  if (index === 0 || question.question_type !== "multi") return true;

  const prev = questions[index - 1];
  const isYesNoGate =
    prev.question_type === "radio" &&
    prev.answer_options.some((a) => a.label === "Yes") &&
    prev.answer_options.some((a) => a.label === "No");
  if (!isYesNoGate) return true;

  const prevResponse = responses[prev.id];
  const selectedId = prevResponse
    ? Object.keys(prevResponse).find((k) => k !== "question_id" && k !== "position")
    : undefined;
  const selectedLabel = selectedId
    ? prev.answer_options.find((a) => a.id.toString() === selectedId)?.label
    : undefined;

  return selectedLabel === "Yes";
};
