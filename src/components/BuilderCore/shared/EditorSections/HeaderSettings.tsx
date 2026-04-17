interface HeaderSettingsProps {
  formMetadata: { title: string; description: string; banner?: string };
  onUpdateMetadata: (updates: {
    title?: string;
    description?: string;
    banner?: string;
  }) => void;
  isQuiz?: boolean;
  onToggleQuiz?: (value: boolean) => void;
}

export function HeaderSettings({
  formMetadata,
  onUpdateMetadata,
  isQuiz = false,
  onToggleQuiz,
}: HeaderSettingsProps) {
  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Form Title
        </label>
        <input
          type="text"
          value={formMetadata.title}
          onChange={(e) => onUpdateMetadata({ title: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={formMetadata.description}
          onChange={(e) => onUpdateMetadata({ description: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image URL
        </label>
        <input
          type="text"
          value={formMetadata.banner}
          onChange={(e) => onUpdateMetadata({ banner: e.target.value })}
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {onToggleQuiz && (
        <div className="pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onToggleQuiz(!isQuiz)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
              isQuiz
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  isQuiz ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isQuiz ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${isQuiz ? "text-gray-900" : "text-gray-700"}`}
              >
                Quiz Mode
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Assign correct answers & point values to questions. Respondents
                see their score on submit.
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
