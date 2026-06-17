"use client";

import { useState } from "react";
import { useActiveCart } from "@/store";
import { useSearchMedications, useSearchAllergies } from "@/api/hooks/useQuestionnaireQueries";
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

const SearchInput = ({
  questionType,
  cartId,
  cartToken,
  currentResponse,
  onAnswerChange,
}: {
  questionType: "medication_search" | "allergy_search";
  cartId: number;
  cartToken?: string;
  currentResponse: AnswerResponseEntry | undefined;
  onAnswerChange: (value: AnswerResponseEntry["metadata"] | null) => void;
}) => {
  const [query, setQuery] = useState("");
  const cartAuth = { cart_id: cartId, cart_token: cartToken };

  const { data: medications = [] } = useSearchMedications(
    query,
    cartAuth,
    questionType === "medication_search",
  );
  const { data: allergies = [] } = useSearchAllergies(
    query,
    cartAuth,
    questionType === "allergy_search",
  );

  const results = questionType === "medication_search" ? medications : allergies;

  const selected = currentResponse?.metadata?.medication_search?.[0] as
    | { name: string }
    | undefined;

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
      />
      {selected && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm">
          <span>{selected.name}</span>
          <button
            type="button"
            onClick={() => onAnswerChange(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
      {query.length > 1 && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                const metadataKey =
                  questionType === "medication_search"
                    ? "medication_search"
                    : "allergy_search";
                onAnswerChange({ [metadataKey]: [item] });
                setQuery("");
              }}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AnswerOption = ({ question, answerOption, currentResponse, dispatch }: Props) => {
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const isChecked = !!currentResponse;

  const onToggle = () => {
    dispatch({
      type: isChecked ? "DESELECT_ANSWER" : "SELECT_ANSWER",
      payload: { answerOption, question },
    });
  };

  const onTextChange = (text: string) => {
    dispatch({
      type: text === "" ? "DESELECT_ANSWER" : "SELECT_ANSWER",
      payload: { answerOption, question, metadata: { text } },
    });
  };

  const onSearchChange = (value: AnswerResponseEntry["metadata"] | null) => {
    dispatch({
      type: value === null ? "DESELECT_ANSWER" : "SELECT_ANSWER",
      payload: { answerOption, question, metadata: value ?? undefined },
    });
  };

  if (["radio", "multi"].includes(question.question_type)) {
    return (
      <div
        onClick={onToggle}
        className={`mb-3 flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
          isChecked
            ? "border-blue-500 bg-white"
            : "border-transparent bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            isChecked ? "border-blue-500 bg-blue-500" : "border-gray-300"
          }`}
        >
          {isChecked && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{answerOption.label}</p>
          {answerOption.extra_label && (
            <p className="mt-0.5 text-xs text-gray-500">{answerOption.extra_label}</p>
          )}
        </div>
      </div>
    );
  }

  if (["text", "textfield"].includes(question.question_type)) {
    return (
      <textarea
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
        rows={question.question_type === "textfield" ? 4 : 1}
        defaultValue={currentResponse?.metadata?.text ?? ""}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={answerOption.label}
      />
    );
  }

  if (["medication_search", "allergy_search"].includes(question.question_type)) {
    return (
      <SearchInput
        questionType={question.question_type as "medication_search" | "allergy_search"}
        cartId={cartId}
        cartToken={cartToken}
        currentResponse={currentResponse}
        onAnswerChange={onSearchChange}
      />
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
