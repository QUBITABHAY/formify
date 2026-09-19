import type { FieldOption } from "./types";

const QUIZ_SUPPORTED_TYPES = ["radio", "select"] as const;
type QuizSupportedType = (typeof QUIZ_SUPPORTED_TYPES)[number];

export function isQuizSupportedField(type: string): type is QuizSupportedType {
  return QUIZ_SUPPORTED_TYPES.includes(type as QuizSupportedType);
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every(
    (v, i) => v.trim().toLowerCase() === sortedB[i].trim().toLowerCase(),
  );
}

function normalizeOptionValue(val: unknown, options?: FieldOption[]): string {
  const str = String(val ?? "").trim();
  if (!options || options.length === 0) return str;
  const found = options.find(
    (o) =>
      o.label.trim().toLowerCase() === str.toLowerCase() ||
      o.value.trim().toLowerCase() === str.toLowerCase(),
  );
  return found ? found.value : str;
}

export function isAnswerCorrect(
  userAnswer: unknown,
  correctAnswer: string | string[] | undefined,
  options?: FieldOption[],
): boolean {
  if (
    correctAnswer === undefined ||
    correctAnswer === null ||
    correctAnswer === ""
  ) {
    return false;
  }

  if (Array.isArray(correctAnswer)) {
    const rawUserList = Array.isArray(userAnswer)
      ? userAnswer
      : userAnswer !== undefined && userAnswer !== null && userAnswer !== ""
        ? [userAnswer]
        : [];
    const normalizedUser = rawUserList.map((v) =>
      normalizeOptionValue(v, options),
    );
    const normalizedCorrect = correctAnswer.map((v) =>
      normalizeOptionValue(v, options),
    );
    return arraysEqual(normalizedUser, normalizedCorrect);
  }

  const normUser = normalizeOptionValue(userAnswer, options);
  const normCorrect = normalizeOptionValue(correctAnswer, options);
  return normUser.toLowerCase() === normCorrect.toLowerCase();
}
