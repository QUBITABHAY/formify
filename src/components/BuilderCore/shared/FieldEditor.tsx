import type {
  FormFieldConfig,
  FieldOption,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
  FormMode,
} from "./types";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
  mode: FormMode;
  selectedScreen: "WELCOME" | "THANKYOU" | "HEADER" | null;
  welcomeScreen: WelcomeScreenConfig;
  thankYouScreen: ThankYouScreenConfig;
  onUpdateWelcome: (updates: Partial<WelcomeScreenConfig>) => void;
  onUpdateThankYou: (updates: Partial<ThankYouScreenConfig>) => void;
  formMetadata: { title: string; description: string; banner: string };
  onUpdateMetadata: (updates: {
    title?: string;
    description?: string;
    banner?: string;
  }) => void;
}

export default function FieldEditor({
  field,
  onUpdate,
  mode,
  selectedScreen,
  welcomeScreen,
  thankYouScreen,
  onUpdateWelcome,
  onUpdateThankYou,
  formMetadata,
  onUpdateMetadata,
}: FieldEditorProps) {
  if (selectedScreen === "HEADER" && mode === "single") {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold text-gray-800">Form Settings</h2>
          <p className="text-sm text-gray-500">Edit form header details</p>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={formMetadata.title}
              onChange={(e) => onUpdateMetadata({ title: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formMetadata.description}
              onChange={(e) =>
                onUpdateMetadata({ description: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
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
              className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedScreen === "WELCOME" && mode === "flow") {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome Screen
            </h2>
          </div>
          <p className="text-sm text-gray-500">Configure the intro screen</p>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={welcomeScreen.title}
              onChange={(e) => onUpdateWelcome({ title: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={welcomeScreen.description}
              onChange={(e) => onUpdateWelcome({ description: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={welcomeScreen.buttonText}
              onChange={(e) => onUpdateWelcome({ buttonText: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedScreen === "THANKYOU" && mode === "flow") {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Thank You Screen
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Configure the completion screen
          </p>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={thankYouScreen.title}
              onChange={(e) => onUpdateThankYou({ title: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={thankYouScreen.description}
              onChange={(e) =>
                onUpdateThankYou({ description: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji
            </label>
            <input
              type="text"
              value={thankYouScreen.emoji}
              onChange={(e) => onUpdateThankYou({ emoji: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-2xl"
              placeholder="🎉"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
        <div className="mb-4 p-4 bg-indigo-50 rounded-full">
          <svg
            className="w-8 h-8 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">Select a field to edit</p>
        <p className="text-xs text-gray-400 mt-1">
          Click any field to edit its properties
        </p>
      </div>
    );
  }

  const handleOptionChange = (
    index: number,
    key: keyof FieldOption,
    value: string,
  ) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(field.options || [])];
    const newIndex = newOptions.length + 1;
    newOptions.push({
      label: `Option ${newIndex}`,
      value: `option${newIndex}`,
    });
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
        <h2 className="text-lg font-semibold text-gray-800">Field Settings</h2>
        <p className="text-sm text-gray-500">
          Editing{" "}
          <span className="font-medium text-indigo-600">{field.type}</span>{" "}
          field
        </p>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "flow" ? "Question Title" : "Label"}
          </label>
          <input
            type="text"
            value={field.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle / Help Text
          </label>
          <input
            type="text"
            value={field.subtitle || ""}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Optional description"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {["text", "email", "tel", "number", "textarea"].includes(
          field.type,
        ) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        {["text", "tel", "textarea"].includes(field.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Length
            </label>
            <input
              type="number"
              value={field.maxLength || ""}
              onChange={(e) =>
                onUpdate({
                  maxLength: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="No limit"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="required"
            checked={field.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="required"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Required field
          </label>
        </div>

        {["radio", "select"].includes(field.type) && (
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(index, "label", e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mt-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
