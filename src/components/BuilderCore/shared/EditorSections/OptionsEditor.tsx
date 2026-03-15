import type { FormFieldConfig, FieldOption } from "../types";

interface OptionsEditorProps {
  field: FormFieldConfig;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
}

export function OptionsEditor({ field, onUpdate }: OptionsEditorProps) {
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
    <div className="pt-4 border-t border-gray-100">
      {field.type === "radio" && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
          <input
            type="checkbox"
            id="multiSelect"
            checked={field.multiSelect || false}
            onChange={(e) => onUpdate({ multiSelect: e.target.checked })}
            className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-300 cursor-pointer"
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
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
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
          className="text-sm text-gray-900 hover:text-indigo-700 font-medium flex items-center gap-1 mt-2"
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
  );
}
