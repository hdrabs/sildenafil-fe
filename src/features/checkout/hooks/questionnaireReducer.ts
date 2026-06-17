import {
  AnswerOption,
  AnswerResponseEntry,
  QuestionaireReducerAction,
  QuestionaireReducerState,
  ResponseShape,
} from "@/types/questionnaire";

const filterSoloAnswers = (
  answers: Record<string, AnswerResponseEntry | number | undefined>,
): Record<string, AnswerResponseEntry> =>
  Object.keys(answers).reduce<Record<string, AnswerResponseEntry>>((result, key) => {
    const entry = answers[key];
    if (entry && typeof entry === "object" && !(entry as AnswerResponseEntry).solo) {
      result[key] = entry as AnswerResponseEntry;
    }
    return result;
  }, {});

const buildNewAnswer = (
  answerOption: AnswerOption,
  metadata?: AnswerResponseEntry["metadata"],
): AnswerResponseEntry => ({
  answer_option_id: answerOption.id,
  position: answerOption.position,
  solo: answerOption.solo,
  disqualify: answerOption.disqualify,
  ...(metadata && { metadata }),
});

export const questionnaireReducer = (
  state: QuestionaireReducerState,
  action: QuestionaireReducerAction,
): QuestionaireReducerState => {
  if (action.type === "SET_INITIAL") {
    return {
      questions: action.payload ?? {},
      hasInteracted: false,
    };
  }

  const { answerOption, question } = action.payload;
  const { id: answer_option_id } = answerOption;
  const isSolo = answerOption.solo || question.question_type === "radio";
  const questions = state.questions;

  if (action.type === "SELECT_ANSWER") {
    const newEntry = buildNewAnswer(answerOption, action.payload.metadata);

    const newResponses: ResponseShape =
      isSolo
        ? ({
            question_id: question.id,
            position: question.position,
            [answer_option_id]: newEntry,
          } as ResponseShape)
        : ({
            ...filterSoloAnswers(questions[question.id] ?? {}),
            question_id: question.id,
            position: question.position,
            [answer_option_id]: newEntry,
          } as ResponseShape);

    return {
      hasInteracted: isSolo,
      questions: { ...questions, [question.id]: newResponses },
    };
  }

  if (action.type === "DESELECT_ANSWER") {
    const currentQuestion = questions[question.id];
    if (!currentQuestion) return state;

    if (isSolo) return { ...state, hasInteracted: true };

    const { [answer_option_id]: _removed, question_id, position, ...remainingAnswers } = currentQuestion as ResponseShape & Record<string, unknown>;

    if (Object.keys(remainingAnswers).length === 0) {
      const { [question.id]: _removedQ, ...remainingQuestions } = questions;
      return { ...state, questions: remainingQuestions };
    }

    return {
      ...state,
      questions: {
        ...questions,
        [question.id]: {
          question_id,
          position,
          ...remainingAnswers,
        } as ResponseShape,
      },
    };
  }

  return state;
};
