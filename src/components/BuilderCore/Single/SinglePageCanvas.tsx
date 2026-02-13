import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableField from "./DraggableField";
import type { FormFieldConfig } from "../shared/types";

interface SinglePageCanvasProps {
  fields: FormFieldConfig[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  formTitle?: string;
  formDescription?: string;
  formBanner?: string;
  onSelectHeader?: () => void;
}

export default function SinglePageCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  formTitle = "Registration Form",
  formDescription = "Please fill out the details below.",
  formBanner = "https://picsum.photos/800/200",
  onSelectHeader,
}: SinglePageCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 overflow-y-auto w-full p-8 bg-gray-100"
      onClick={() => onSelectField(null)}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectHeader?.();
          }}
          className={`bg-white shadow-xl rounded-lg overflow-hidden border transition-all cursor-pointer group
            ${selectedFieldId === "HEADER" ? "ring-2 ring-gray-900 border-gray-900" : "border-gray-100 hover:border-gray-900"}
          `}
        >
          <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100 relative group-hover:opacity-95 transition-opacity">
            <img
              src={formBanner}
              alt="Form Banner"
              className="w-full h-full object-cover block"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all font-medium text-transparent group-hover:text-white">
              Click to Edit Header
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              {formTitle}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              {formDescription}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-red-700">
              <span>*Indicates required question.</span>
            </div>
          </div>
        </div>

        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 min-h-[200px]">
            {fields.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center text-gray-500">
                Drag and drop fields here from the palette on the left
              </div>
            ) : (
              fields.map((field) => (
                <DraggableField
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onClick={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
