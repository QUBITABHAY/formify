import type { FormFieldConfig, ConditionalRule } from "../types";

interface LogicEditorProps {
  field: FormFieldConfig;
  allFields: FormFieldConfig[];
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
}

function generateRuleId(): string {
  return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function LogicEditor({ field, allFields, onUpdate }: LogicEditorProps) {
  return (
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
          className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-300 cursor-pointer"
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
          {field.logic.rules.map((rule: ConditionalRule, ruleIndex: number) => (
            <div key={rule.id} className="p-3 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900">
                  Rule {ruleIndex + 1}
                </span>
                <button
                  onClick={() => {
                    const newRules = field.logic!.rules.filter(
                      (_, i) => i !== ruleIndex,
                    );
                    onUpdate({
                      logic:
                        newRules.length > 0 ? { rules: newRules } : undefined,
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
                      operator: e.target.value as ConditionalRule["operator"],
                    };
                    onUpdate({ logic: { rules: newRules } });
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm bg-white"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm bg-white"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm bg-white"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm"
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
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm bg-white"
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
          ))}

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
            className="text-sm text-gray-900 font-medium flex items-center gap-1 mt-2"
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
  );
}
