import type { FormFieldConfig, FieldOption } from "./types";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  onUpdate: (updates: Partial<FormFieldConfig>) => void;
  isHeaderSelected?: boolean;
  formMetadata?: {
    title: string;
    description: string;
    banner: string;
  };
  onUpdateMetadata?: (updates: {
    title?: string;
    description?: string;
    banner?: string;
  }) => void;
}

export default function FieldEditor({
  field,
  onUpdate,
  isHeaderSelected,
  formMetadata,
  onUpdateMetadata,
}: FieldEditorProps) {
  if (isHeaderSelected && formMetadata && onUpdateMetadata) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto shadow-sm z-10">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Form Settings</h2>
          <p className="text-sm text-gray-500">Edit form header details</p>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={formMetadata.title}
              onChange={(e) => onUpdateMetadata({ title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={formMetadata.description}
              onChange={(e) =>
                onUpdateMetadata({ description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <div className="mb-3 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formMetadata.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formMetadata.banner}
                  onChange={(e) => onUpdateMetadata({ banner: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR Upload</span>
                </div>
              </div>

              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-6 h-6 mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-xs text-gray-500">Click to upload image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateMetadata({ banner: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!field) {
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
          Select a field or the header to edit properties
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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto shadow-sm z-10">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Field Settings</h2>
        <p className="text-sm text-gray-500">
          Edit properties for {field.type}
        </p>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={field.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
            placeholder="Optional help text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all"
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
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="required"
            checked={field.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
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
            <div className="space-y-3">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(index, "label", e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
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
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
