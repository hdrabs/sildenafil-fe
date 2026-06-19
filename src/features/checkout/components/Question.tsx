"use client";

import { useState } from "react";
import { useActiveCart } from "@/store";
import { useSearchMedications, useSearchAllergies } from "@/api/hooks/useQuestionnaireQueries";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AnswerOption as AnswerOptionType,
  AnswerResponseEntry,
  Question as QuestionType,
  QuestionaireReducerAction,
  ResponseShape,
  AllergyResult,
  MedicationResult,
  MedItem,
} from "@/types/questionnaire";
import { AnswerOption } from "./AnswerOption";

interface Props {
  question: QuestionType;
  dispatch: (action: QuestionaireReducerAction) => void;
  response: ResponseShape | Record<string, never>;
  userGender?: string;
  showBpSampleCard?: boolean;
  showLearnMore?: boolean;
}

// ─── Edit Medication Modal ────────────────────────────────────────────────────

type EditMedModalProps = {
  item: MedItem;
  onSave: (updated: MedItem) => void;
  onRemove: () => void;
  onClose: () => void;
};

const EditMedicationModal = ({ item, onSave, onRemove, onClose }: EditMedModalProps) => {
  const [name, setName] = useState(item.name);
  const [strength, setStrength] = useState(item.strength ?? "");
  const [duration, setDuration] = useState(item.duration ?? "");
  const [condition, setCondition] = useState(item.condition ?? "");

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" />
      <div
        className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg cursor-default rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Edit Medication Details</h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Fields 2×2 grid */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#e05c4b] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-sm text-gray-600">
                Strength
                <span
                  title="e.g. 10mg, 500mg/5mL"
                  className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-[#e05c4b] text-[10px] font-bold text-white"
                >
                  ?
                </span>
              </label>
              <input
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#e05c4b] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Duration</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 months"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#e05c4b] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Condition</label>
              <input
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g. Hypertension"
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#e05c4b] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer text-sm font-bold uppercase tracking-widest text-[#e05c4b] hover:text-[#c94f3e]"
            >
              Remove this med
            </button>
            <button
              type="button"
              onClick={() => onSave({ ...item, name: name.trim() || item.name, strength, duration, condition })}
              className="ml-auto cursor-pointer rounded-full bg-[#e05c4b] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#c94f3e]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Blood Pressure Sample Card ───────────────────────────────────────────────

const BloodPressureSampleCard = () => (
  <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
    <p className="border-b border-gray-100 px-4 py-2 text-center text-xs font-medium text-gray-500">
      Sample reading
    </p>
    <div className="divide-y divide-gray-100">
      <div className="flex items-center px-4 py-3">
        <span className="w-20 text-sm font-semibold text-gray-700">Top #</span>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-bold text-gray-900">120</span>
          <span className="text-xs text-gray-400">mmHg</span>
        </div>
        <span className="w-20 text-right text-sm text-gray-500">Systolic</span>
      </div>
      <div className="flex items-center px-4 py-3">
        <span className="w-20 text-sm font-semibold text-gray-700">Bottom #</span>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-bold text-gray-900">80</span>
          <span className="text-xs text-gray-400">mmHg</span>
        </div>
        <span className="w-20 text-right text-sm text-gray-500">Diastolic</span>
      </div>
    </div>
  </div>
);

// ─── Inline Search Section ────────────────────────────────────────────────────

const InlineSearchSection = ({
  question,
  yesAnswerOption,
  currentItems,
  dispatch,
}: {
  question: QuestionType;
  yesAnswerOption: AnswerOptionType;
  currentItems: MedItem[];
  dispatch: (action: QuestionaireReducerAction) => void;
}) => {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MedItem | null>(null);
  const debouncedQuery = useDebounce(query, 400);
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;
  const cartAuth = { cart_id: cartId, cart_token: cartToken };

  const isAllergy = question.question_type === "allergy_search";
  const isMedication = question.question_type === "medication_search";
  const searchKey = isAllergy ? "allergy_search" : "medication_search";

  const { data: medications = [], isFetching: fetchingMeds } = useSearchMedications(
    debouncedQuery,
    cartAuth,
    !isAllergy && debouncedQuery.length >= 3,
  );
  const { data: allergies = [], isFetching: fetchingAllergies } = useSearchAllergies(
    debouncedQuery,
    cartAuth,
    isAllergy && debouncedQuery.length >= 3,
  );
  const results: (AllergyResult | MedicationResult)[] = isAllergy ? allergies : medications;
  const isSearching = isAllergy ? fetchingAllergies : fetchingMeds;

  const updateItems = (newItems: MedItem[]) => {
    dispatch({
      type: "SELECT_ANSWER",
      payload: {
        answerOption: yesAnswerOption,
        question,
        metadata: { [searchKey]: newItems },
      },
    });
  };

  const addItem = (item: MedItem) => {
    if (!currentItems.some((i) => String(i.id) === String(item.id))) {
      updateItems([...currentItems, item]);
    }
    setQuery("");
  };

  const addManual = () => {
    const trimmed = query.trim();
    if (trimmed) {
      addItem({ id: `manual-${Date.now()}`, name: trimmed });
    }
  };

  const removeItem = (id: string | number) => {
    updateItems(currentItems.filter((i) => String(i.id) !== String(id)));
    setEditingItem(null);
  };

  const saveEdit = (updated: MedItem) => {
    updateItems(currentItems.map((i) => (String(i.id) === String(updated.id) ? updated : i)));
    setEditingItem(null);
  };

  const detailLabel = (item: MedItem) => {
    const parts = [item.strength, item.duration, item.condition].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : "Add dosage and duration";
  };

  return (
    <div className="mt-4">
      {/* Medication info card */}
      {isMedication && (
        <div className="mb-5 flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              {/* Pill icon */}
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-500" fill="currentColor">
                <path d="M4.22 11.29l6.07-6.07a5 5 0 017.07 7.07l-6.07 6.07a5 5 0 01-7.07-7.07zm1.41 5.66a3 3 0 004.24 0l2.83-2.83-4.24-4.24-2.83 2.83a3 3 0 000 4.24zm5.66-5.66l2.83-2.83a3 3 0 10-4.24-4.24L7.05 7.05l4.24 4.24z" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e05c4b]">
              <svg viewBox="0 0 20 20" fill="white" className="h-3 w-3">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </span>
          </div>
          <p className="text-sm leading-snug text-gray-600">
            Our Clinicians use this information in determining a safe and effective treatment.
          </p>
        </div>
      )}

      {!isMedication && (
        <p className="mb-3 text-sm font-semibold leading-snug text-gray-800">
          Please list what you are allergic to and the reaction that each allergy causes. This field
          is required.
        </p>
      )}

      {/* Search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManual()}
            placeholder={isAllergy ? "Add allergy" : "Add medication"}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-9 pr-4 text-sm focus:border-[#e05c4b] focus:outline-none"
          />
          {debouncedQuery.length >= 3 && (isSearching || results.length > 0) && (
            <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
              {isSearching ? (
                <li className="flex items-center justify-center px-4 py-3">
                  <svg className="h-5 w-5 animate-spin text-[#e05c4b]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </li>
              ) : (
                results.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => addItem({ id: item.id, name: item.name, strength: (item as MedItem).strength })}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <span>{item.name}</span>
                    {(item as MedItem).strength && (
                      <span className="ml-2 text-xs text-gray-400">{(item as MedItem).strength}</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={addManual}
          className="cursor-pointer rounded-lg bg-[#e05c4b] px-5 py-3 text-sm font-bold text-white hover:bg-[#c94f3e]"
        >
          ADD
        </button>
      </div>

      {/* Item list */}
      {currentItems.length > 0 && (
        <div className="mt-3 space-y-2">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                {isMedication && (
                  <p className="text-xs text-gray-400">{detailLabel(item)}</p>
                )}
              </div>
              {isMedication ? (
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="cursor-pointer text-sm font-semibold text-[#e05c4b] hover:text-[#c94f3e]"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="cursor-pointer text-sm font-medium text-[#e05c4b] hover:text-[#c94f3e]"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingItem && (
        <EditMedicationModal
          item={editingItem}
          onSave={saveEdit}
          onRemove={() => removeItem(editingItem.id)}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// ─── Question ─────────────────────────────────────────────────────────────────

export const Question = ({
  question,
  dispatch,
  response,
  userGender,
  showBpSampleCard,
  showLearnMore = false,
}: Props) => {
  const [subtitleOpen, setSubtitleOpen] = useState(false);
  const visibleAnswerOptions = userGender
    ? question.answer_options.filter(
        (a: AnswerOptionType) => a.gender === "both" || a.gender === userGender,
      )
    : question.answer_options;

  const isSearchQuestion = ["allergy_search", "medication_search"].includes(
    question.question_type,
  );
  const isMedicationSearch = question.question_type === "medication_search";

  // For medication_search: always show search directly, no Yes/No gate.
  // For allergy_search: gate behind Yes/No answer option.
  const implicitOption = isMedicationSearch ? question.answer_options[0] : undefined;

  const selectedOptionId = isSearchQuestion && !isMedicationSearch
    ? Object.keys(response).find((k) => k !== "question_id" && k !== "position")
    : implicitOption?.id.toString();
  const selectedOption = selectedOptionId
    ? question.answer_options.find((ao) => ao.id.toString() === selectedOptionId)
    : undefined;
  const showSearch = isMedicationSearch
    ? !!implicitOption
    : !!selectedOption && selectedOption.label.toLowerCase() !== "no";

  const searchKey =
    question.question_type === "allergy_search" ? "allergy_search" : "medication_search";

  const medItemsOptionId = isMedicationSearch
    ? implicitOption?.id.toString()
    : selectedOptionId;
  const currentItems: MedItem[] =
    medItemsOptionId
      ? (((response as Record<string, unknown>)[medItemsOptionId] as AnswerResponseEntry)
          ?.metadata?.[searchKey] as MedItem[] | undefined) ?? []
      : [];

  return (
    <div className="mb-6">
      {showBpSampleCard && <BloodPressureSampleCard />}

      <div className="mb-4">
        <h3 className="mb-4 text-[20px] font-semibold leading-[34px] xs:text-2xl">
          {question.text}
        </h3>
        {showLearnMore && question.subtitle && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setSubtitleOpen((o) => !o)}
              className="text-sm font-medium text-[#e05c4b] hover:text-[#c94f3e]"
            >
              {subtitleOpen ? "−" : "+"} Learn how this information is used by your doctor
            </button>
            {subtitleOpen && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{question.subtitle}</p>
            )}
          </div>
        )}
        {!showLearnMore && question.subtitle && question.question_type !== "statement" && (
          <div
            className="mt-2 text-sm font-normal leading-relaxed text-gray-500"
            dangerouslySetInnerHTML={{ __html: question.subtitle }}
          />
        )}
      </div>

      <div className="mt-4">
        {isMedicationSearch ? null : question.question_type === "textfield_disabled" ? (
          <div className="mb-4">
            <p className="mb-1 text-xs text-gray-400">Treatment</p>
            <input
              type="text"
              disabled
              value={visibleAnswerOptions[0]?.label ?? ""}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
            />
          </div>
        ) : question.question_type === "dropdown" ? (
          (() => {
            const firstOption = visibleAnswerOptions[0];
            const currentResp = firstOption
              ? ((response as Record<string, unknown>)[firstOption.id] as AnswerResponseEntry | undefined)
              : undefined;
            const selectedValue = currentResp?.metadata?.text ?? "";
            const onSelect = (value: string) => {
              if (!firstOption) return;
              if (value === "") {
                dispatch({ type: "DESELECT_ANSWER", payload: { answerOption: firstOption, question } });
              } else {
                dispatch({ type: "SELECT_ANSWER", payload: { answerOption: firstOption, question, metadata: { text: value } } });
              }
            };
            return (
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
                  value={selectedValue}
                  onChange={(e) => onSelect(e.target.value)}
                >
                  <option value="" disabled>Please select the correct strength</option>
                  {visibleAnswerOptions.map((opt) => (
                    <option key={opt.id} value={opt.label}>{opt.label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            );
          })()
        ) : (
          visibleAnswerOptions.map((answerOption: AnswerOptionType) => (
            <AnswerOption
              key={answerOption.id}
              answerOption={answerOption}
              dispatch={dispatch}
              question={question}
              currentResponse={
                (response as Record<string, unknown>)[answerOption.id] as
                  | AnswerResponseEntry
                  | undefined
              }
            />
          ))
        )}
      </div>

      {isSearchQuestion && showSearch && (implicitOption ?? selectedOption) && (
        <InlineSearchSection
          question={question}
          yesAnswerOption={(implicitOption ?? selectedOption)!}
          currentItems={currentItems}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};
