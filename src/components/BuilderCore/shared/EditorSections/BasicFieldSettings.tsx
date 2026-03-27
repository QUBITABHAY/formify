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
            min="1"
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

      {field.type === "time" && (
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                Min Time
              </label>
              {field.minTime && (
                <button
                  type="button"
                  onClick={() => onUpdate({ minTime: undefined })}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type={field.minTime ? "time" : "text"}
              placeholder="hh : mm a"
              value={field.minTime || ""}
              onChange={(e) => onUpdate({ minTime: e.target.value })}
              onFocus={(e) => {
                e.target.type = "time";
                try { e.target.showPicker?.(); } catch { /* ignore */ }
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.type === "text") target.type = "time";
                try { target.showPicker?.(); } catch { /* ignore */ }
              }}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                Max Time
              </label>
              {field.maxTime && (
                <button
                  type="button"
                  onClick={() => onUpdate({ maxTime: undefined })}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type={field.maxTime ? "time" : "text"}
              placeholder="hh : mm a"
              value={field.maxTime || ""}
              onChange={(e) => onUpdate({ maxTime: e.target.value })}
              onFocus={(e) => {
                e.target.type = "time";
                try { e.target.showPicker?.(); } catch { /* ignore */ }
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.type === "text") target.type = "time";
                try { target.showPicker?.(); } catch { /* ignore */ }
              }}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
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
