"use client";

import {
  AnswerOption as AnswerOptionType,
  AnswerResponseEntry,
  Question,
  QuestionaireReducerAction,
} from "@/types/questionnaire";

interface Props {
  question: Question;
  answerOption: AnswerOptionType;
  currentResponse: AnswerResponseEntry | undefined;
  dispatch: (action: QuestionaireReducerAction) => void;
}

export const AnswerOption = ({ question, answerOption, currentResponse, dispatch }: Props) => {
  const isChecked = !!currentResponse;

  const onToggle = () => {
    if (isChecked) {
      dispatch({ type: "DESELECT_ANSWER", payload: { answerOption, question } });
    } else {
      dispatch({ type: "SELECT_ANSWER", payload: { answerOption, question } });
    }
  };

  const onTextChange = (text: string) => {
    if (text === "") {
      dispatch({ type: "DESELECT_ANSWER", payload: { answerOption, question } });
    } else {
      dispatch({ type: "SELECT_ANSWER", payload: { answerOption, question, metadata: { text } } });
    }
  };

  if (
    ["radio", "multi", "blood_pressure", "allergy_search", "medication_search"].includes(
      question.question_type,
    )
  ) {
    const BP_TAG_COLORS: Record<string, string> = {
      Low: "bg-red-100 text-red-600",
      Normal: "bg-green-100 text-green-700",
      Elevated: "bg-orange-100 text-orange-600",
      High: "bg-red-100 text-red-600",
    };
    const bpTagClass = answerOption.extra_label
      ? BP_TAG_COLORS[answerOption.extra_label]
      : undefined;

    const isYesOnSearchQuestion =
      ["allergy_search", "medication_search"].includes(question.question_type) &&
      answerOption.label.toLowerCase() === "yes";

    const isBpOption =
      !!bpTagClass || question.question_type === "blood_pressure" || isYesOnSearchQuestion;

    const isCheckbox = question.question_type === "multi";
    const isOtherOption = isCheckbox && answerOption.label === "Other";

    return (
      <div className="mb-3">
        <div
          onClick={onToggle}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-white p-4 transition-colors ${
            isChecked ? "border-red-400" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          {isCheckbox ? (
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                isChecked ? "border-red-400 bg-red-400" : "border-gray-300 bg-white"
              }`}
            >
              {isChecked && (
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ) : (
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                isChecked ? "border-red-400 bg-red-400" : "border-gray-300 bg-white"
              }`}
            >
              {isChecked && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          )}

          {isBpOption ? (
            <>
              <p className="flex-1 text-sm font-medium text-gray-900">{answerOption.label}</p>
              {bpTagClass && (
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${bpTagClass}`}>
                  {answerOption.extra_label}
                </span>
              )}
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-900">{answerOption.label}</p>
              {answerOption.extra_label && (
                <p className="mt-0.5 text-xs text-gray-500">{answerOption.extra_label}</p>
              )}
            </div>
          )}
        </div>

        {isOtherOption && isChecked && (
          <div className="mt-1">
            <p className="mb-1 text-xs text-gray-400">
              Please describe the side effect(s) that you experienced
            </p>
            <textarea
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:outline-none"
              rows={5}
              defaultValue={currentResponse?.metadata?.text ?? ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                dispatch({
                  type: "SELECT_ANSWER",
                  payload: { answerOption, question, metadata: { text: e.target.value } },
                });
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (["text", "textfield"].includes(question.question_type)) {
    return (
      <textarea
        className="w-full min-h-[280px] resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:outline-none"
        defaultValue={currentResponse?.metadata?.text ?? ""}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={answerOption.label}
      />
    );
  }

  if (question.question_type === "textfield_disabled") {
    return (
      <div className="mb-4">
        <p className="mb-1 text-xs text-gray-400">{question.text}</p>
        <input
          type="text"
          disabled
          value={answerOption.label}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
        />
      </div>
    );
  }

  // statement — display only
  if (question.question_type === "statement") {
    return (
      <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {answerOption.label}
      </p>
    );
  }

  return null;
};
