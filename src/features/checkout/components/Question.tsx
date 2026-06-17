import {
  AnswerOption as AnswerOptionType,
  Question as QuestionType,
  QuestionaireReducerAction,
  ResponseShape,
} from "@/types/questionnaire";
import { AnswerOption } from "./AnswerOption";

interface Props {
  question: QuestionType;
  dispatch: (action: QuestionaireReducerAction) => void;
  response: ResponseShape | Record<string, never>;
  userGender?: string;
}

export const Question = ({ question, dispatch, response, userGender }: Props) => {
  const visibleAnswerOptions = userGender
    ? question.answer_options.filter(
        (a: AnswerOptionType) => a.gender === "both" || a.gender === userGender,
      )
    : question.answer_options;

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold leading-8">{question.text}</h3>
        {question.subtitle && (
          <div
            className="mt-4 text-base font-normal leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: question.subtitle }}
          />
        )}
      </div>

      <div className="mt-4">
        {visibleAnswerOptions.map((answerOption: AnswerOptionType) => (
          <AnswerOption
            key={answerOption.id}
            answerOption={answerOption}
            dispatch={dispatch}
            question={question}
            currentResponse={
              (response as Record<string, unknown>)[answerOption.id] as
                | import("@/types/questionnaire").AnswerResponseEntry
                | undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
