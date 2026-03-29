import { memo } from "react";
import type {
  FormFieldConfig,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
  FormMode,
  RatingSymbol,
} from "./types";
import { ScreenEditor } from "./EditorSections/ScreenEditor";
import { HeaderSettings } from "./EditorSections/HeaderSettings";
import { BasicFieldSettings } from "./EditorSections/BasicFieldSettings";
import { OptionsEditor } from "./EditorSections/OptionsEditor";
import { LogicEditor } from "./EditorSections/LogicEditor";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
  mode: FormMode;
  selectedScreen: "WELCOME" | "THANKYOU" | "HEADER" | null;
  welcomeScreen: WelcomeScreenConfig;
  thankYouScreen: ThankYouScreenConfig;
  onUpdateWelcome: (updates: Partial<WelcomeScreenConfig>) => void;
  onUpdateThankYou: (updates: Partial<ThankYouScreenConfig>) => void;
  formMetadata: { title: string; description: string; banner?: string };
  onUpdateMetadata: (updates: {
    title?: string;
    description?: string;
    banner?: string;
  }) => void;
  allFields?: FormFieldConfig[];
}

const FieldEditor = memo(function FieldEditor({
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
        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-800">Form Settings</h2>
          <p className="text-sm text-gray-500">Edit form header details</p>
        </div>
        <HeaderSettings
          formMetadata={formMetadata}
          onUpdateMetadata={onUpdateMetadata}
        />
      </div>
    );
  }

  if (
    (selectedScreen === "WELCOME" && mode === "flow") ||
    selectedScreen === "THANKYOU"
  ) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedScreen === "WELCOME"
              ? "Welcome Screen"
              : "Thank You Screen"}
          </h2>
          <p className="text-sm text-gray-500">
            {selectedScreen === "WELCOME"
              ? "Configure the intro screen"
              : "Configure the completion screen"}
          </p>
        </div>
        <ScreenEditor
          selectedScreen={selectedScreen}
          welcomeScreen={welcomeScreen}
          onUpdateWelcome={onUpdateWelcome}
          thankYouScreen={thankYouScreen}
          onUpdateThankYou={onUpdateThankYou}
        />
      </div>
    );
  }

  if (!field || field.type === "page_break") {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
        <div className="mb-4 p-4 bg-gray-50 rounded-full">
          <svg
            className="w-8 h-8 text-gray-400"
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
        <p className="text-sm font-medium">
          {!field ? "Select a field to edit" : "Page Break"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {!field
            ? "Click any field to edit its properties"
            : "This element marks a new page. No settings available."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <h2 className="text-lg font-semibold text-gray-800">Field Settings</h2>
        <p className="text-sm text-gray-500">
          Editing{" "}
          <span className="font-medium text-gray-900">{field.type}</span> field
        </p>
      </div>

      <div className="p-4 space-y-5">
        <BasicFieldSettings field={field} mode={mode} onUpdate={onUpdate} />

        {["radio", "select"].includes(field.type) && (
          <OptionsEditor field={field} onUpdate={onUpdate} />
        )}

        {field.type === "date" && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Constraints
            </label>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500">
                  Minimum Date
                </label>
                {field.minDate && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ minDate: undefined })}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type={field.minDate ? "date" : "text"}
                placeholder="dd/mm/yyyy"
                value={field.minDate || ""}
                onChange={(e) =>
                  onUpdate({ minDate: e.target.value || undefined })
                }
                onFocus={(e) => {
                  e.target.type = "date";
                  try { e.target.showPicker?.(); } catch { /* ignore */ }
                }}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.type === "text") target.type = "date";
                  try { target.showPicker?.(); } catch { /* ignore */ }
                }}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500">
                  Maximum Date
                </label>
                {field.maxDate && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ maxDate: undefined })}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type={field.maxDate ? "date" : "text"}
                placeholder="dd/mm/yyyy"
                value={field.maxDate || ""}
                onChange={(e) =>
                  onUpdate({ maxDate: e.target.value || undefined })
                }
                onFocus={(e) => {
                  e.target.type = "date";
                  try { e.target.showPicker?.(); } catch { /* ignore */ }
                }}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.type === "text") target.type = "date";
                  try { target.showPicker?.(); } catch { /* ignore */ }
                }}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>
        )}

        {field.type === "rating" && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
             <label className="block text-sm font-medium text-gray-700">
              Rating Configuration
            </label>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Maximum Stars (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={field.maxRating || 5}
                onChange={(e) =>
                  onUpdate({ maxRating: parseInt(e.target.value) || 5 })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Rating Symbol
              </label>
              <select
                value={field.ratingSymbol || "star"}
                onChange={(e) =>
                  onUpdate({ ratingSymbol: e.target.value as RatingSymbol })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none transition-all text-sm bg-white"
              >
                <option value="star">Stars</option>
                <option value="heart">Hearts</option>
                <option value="smile">Smiles</option>
                <option value="thumb">Thumbs Up</option>
              </select>
            </div>
          </div>
        )}

        {mode === "flow" && (
          <LogicEditor
            field={field}
            allFields={allFields}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
});

export default FieldEditor;
