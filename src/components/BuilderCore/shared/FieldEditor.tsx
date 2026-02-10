import type {
  FormFieldConfig,
  FieldOption,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
  FormMode,
  ConditionalRule,
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
  allFields?: FormFieldConfig[];
}

function generateRuleId(): string {
  return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
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
  allFields = [],
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
            {field.type === "radio" && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <input
                  type="checkbox"
                  id="multiSelect"
                  checked={field.multiSelect || false}
                  onChange={(e) => onUpdate({ multiSelect: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="multiSelect"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Allow multiple selections
                </label>
              </div>
            )}
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

        {field.type === "date" && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Constraints
            </label>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Minimum Date
              </label>
              <input
                type="date"
                value={field.minDate || ""}
                onChange={(e) =>
                  onUpdate({ minDate: e.target.value || undefined })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Maximum Date
              </label>
              <input
                type="date"
                value={field.maxDate || ""}
                onChange={(e) =>
                  onUpdate({ maxDate: e.target.value || undefined })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>
        )}
        {mode === "flow" && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 rounded-lg mb-4">
              <input
                type="checkbox"
                id="conditionalLogic"
                checked={!!(field.logic && field.logic.rules.length > 0)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onUpdate({
                      logic: {
                        rules: [
                          {
                            id: generateRuleId(),
                            operator: "equals",
                            value: "",
                            targetFieldId: "",
                          },
                        ],
                      },
                    });
                  } else {
                    onUpdate({ logic: undefined });
                  }
                }}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="conditionalLogic"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Conditional Logic
              </label>
            </div>

            {field.logic && field.logic.rules.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rules
                </label>
                {field.logic.rules.map(
                  (rule: ConditionalRule, ruleIndex: number) => (
                    <div key={rule.id} className="p-3 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-indigo-600">
                          Rule {ruleIndex + 1}
                        </span>
                        <button
                          onClick={() => {
                            const newRules = field.logic!.rules.filter(
                              (_, i) => i !== ruleIndex,
                            );
                            onUpdate({
                              logic:
                                newRules.length > 0
                                  ? { rules: newRules }
                                  : undefined,
                            });
                          }}
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

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          If answer
                        </label>
                        <select
                          value={rule.operator}
                          onChange={(e) => {
                            const newRules = [...field.logic!.rules];
                            newRules[ruleIndex] = {
                              ...newRules[ruleIndex],
                              operator: e.target
                                .value as ConditionalRule["operator"],
                            };
                            onUpdate({ logic: { rules: newRules } });
                          }}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Does not equal</option>
                          <option value="contains">Contains</option>
                          <option value="not_contains">Does not contain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Value
                        </label>
                        {field.type === "checkbox" ? (
                          <select
                            value={rule.value}
                            onChange={(e) => {
                              const newRules = [...field.logic!.rules];
                              newRules[ruleIndex] = {
                                ...newRules[ruleIndex],
                                value: e.target.value,
                              };
                              onUpdate({ logic: { rules: newRules } });
                            }}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                          >
                            <option value="">Select state...</option>
                            <option value="true">Checked</option>
                            <option value="false">Unchecked</option>
                          </select>
                        ) : field.options && field.options.length > 0 ? (
                          <select
                            value={rule.value}
                            onChange={(e) => {
                              const newRules = [...field.logic!.rules];
                              newRules[ruleIndex] = {
                                ...newRules[ruleIndex],
                                value: e.target.value,
                              };
                              onUpdate({ logic: { rules: newRules } });
                            }}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                          >
                            <option value="">Select a value...</option>
                            {field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => {
                              const newRules = [...field.logic!.rules];
                              newRules[ruleIndex] = {
                                ...newRules[ruleIndex],
                                value: e.target.value,
                              };
                              onUpdate({ logic: { rules: newRules } });
                            }}
                            placeholder="Enter value..."
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Then jump to
                        </label>
                        <select
                          value={rule.targetFieldId}
                          onChange={(e) => {
                            const newRules = [...field.logic!.rules];
                            newRules[ruleIndex] = {
                              ...newRules[ruleIndex],
                              targetFieldId: e.target.value,
                            };
                            onUpdate({ logic: { rules: newRules } });
                          }}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                        >
                          <option value="">Select target...</option>
                          {allFields
                            .filter((f) => f.id !== field.id)
                            .map((f, idx) => (
                              <option key={f.id} value={f.id}>
                                {idx + 1}. {f.title || "Untitled"}
                              </option>
                            ))}
                          <option value="SUBMIT">→ Submit form</option>
                        </select>
                      </div>
                    </div>
                  ),
                )}

                <button
                  onClick={() => {
                    const newRules = [
                      ...field.logic!.rules,
                      {
                        id: generateRuleId(),
                        operator: "equals" as const,
                        value: "",
                        targetFieldId: "",
                      },
                    ];
                    onUpdate({ logic: { rules: newRules } });
                  }}
                  className="text-sm text-indigo-600 font-medium flex items-center gap-1 mt-2"
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
                  Add Rule
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
