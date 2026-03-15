import type { FormFieldConfig, FormMode } from "../types";

interface BasicFieldSettingsProps {
  field: FormFieldConfig;
  mode: FormMode;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
}

export function BasicFieldSettings({
  field,
  mode,
  onUpdate,
}: BasicFieldSettingsProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {mode === "flow" ? "Question Title" : "Label"}
        </label>
        <input
          type="text"
          value={field.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={field.subtitle || ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Optional description"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
        />
      </div>

      {["text", "email", "tel", "number", "textarea"].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 transition-all"
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
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="required"
          checked={field.required || false}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-300 cursor-pointer"
        />
        <label
          htmlFor="required"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Required field
        </label>
      </div>
    </div>
  );
}
