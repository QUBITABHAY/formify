import type { FormFieldConfig } from "../types";
import { isQuizSupportedField } from "../quizUtils";

interface QuizAnswerSettingsProps {
  field: FormFieldConfig;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
}

export function QuizAnswerSettings({
  field,
  onUpdate,
}: QuizAnswerSettingsProps) {
  if (!isQuizSupportedField(field.type)) return null;

  const options = field.options || [];
  const points = field.points ?? 1;
  const isMulti = field.type === "radio" && field.multiSelect;

  const correctAnswers: string[] = isMulti
    ? Array.isArray(field.correctAnswer)
      ? (field.correctAnswer as string[])
      : []
    : field.correctAnswer
      ? [field.correctAnswer as string]
      : [];

  const toggleAnswer = (value: string) => {
    if (isMulti) {
      const next = correctAnswers.includes(value)
        ? correctAnswers.filter((v) => v !== value)
        : [...correctAnswers, value];
      onUpdate({ correctAnswer: next.length > 0 ? next : undefined });
    } else {
      const alreadySelected = correctAnswers[0] === value;
      onUpdate({ correctAnswer: alreadySelected ? undefined : value });
    }
  };

  const hasAnswer = correctAnswers.length > 0;

  return (
    <div className="pt-4 border-t border-gray-100 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quiz Answer
        </label>
        {isMulti && (
          <p className="text-xs text-gray-400 mt-0.5">
            Select all correct answers
          </p>
        )}
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-gray-400 italic">
          Add options above to set a correct answer.
        </p>
      ) : (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isMulti ? "Correct answers" : "Correct answer"}
          </label>
          {options.map((option) => {
            const isCorrect = correctAnswers.includes(option.value);
            const indicatorClass = isMulti
              ? `w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
                  isCorrect ? "border-white bg-white" : "border-gray-300"
                }`
              : `w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  isCorrect ? "border-white bg-white" : "border-gray-300"
                }`;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleAnswer(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                  isCorrect
                    ? "border-gray-900 bg-gray-900 text-white font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className={indicatorClass}>
                  {isCorrect && (
                    <svg
                      className="w-2.5 h-2.5 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
          {hasAnswer && (
            <button
              type="button"
              onClick={() => onUpdate({ correctAnswer: undefined })}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear {isMulti ? "correct answers" : "correct answer"}
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Point value
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={points}
            onChange={(e) =>
              onUpdate({ points: Math.max(0, parseInt(e.target.value) || 0) })
            }
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
          />
          <span className="text-xs text-gray-500">points</span>
        </div>
      </div>
    </div>
  );
}
