const QUIZ_SUPPORTED_TYPES = ["radio", "select"] as const;
type QuizSupportedType = (typeof QUIZ_SUPPORTED_TYPES)[number];

export function isQuizSupportedField(type: string): type is QuizSupportedType {
  return QUIZ_SUPPORTED_TYPES.includes(type as QuizSupportedType);
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export function isAnswerCorrect(
  userAnswer: unknown,
  correctAnswer: string | string[] | undefined,
): boolean {
  if (correctAnswer === undefined) return false;
  if (Array.isArray(correctAnswer)) {
    const user = Array.isArray(userAnswer) ? userAnswer : [];
    return arraysEqual(user, correctAnswer);
  }
  return userAnswer === correctAnswer;
}
