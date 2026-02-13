import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormFieldConfig } from "../shared/types";
import InputField from "../../common/InputField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import RadioButton from "../../common/RadioButton";
import Checkbox from "../../common/Checkbox";
import DatePicker from "../../common/DatePicker";
import FileUpload from "../../common/FileUpload";

interface DraggableFieldProps {
  field: FormFieldConfig;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function DraggableField({
  field,
  isSelected,
  onClick,
  onDelete,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <InputField
            title={field.title}
            type={field.type}
            placeholder={field.placeholder}
            disabled={true}
          />
        );
      case "textarea":
        return (
          <TextArea
            title={field.title}
            placeholder={field.placeholder}
            rows={3}
            disabled={true}
          />
        );
      case "radio":
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-2 block">
              {field.title}
            </label>
            <div className="flex flex-col gap-2">
              {field.options?.map((opt, i) => (
                <RadioButton
                  key={i}
                  title={opt.label}
                  name={field.id}
                  value={opt.value}
                />
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return <Checkbox title={field.title} />;
      case "select":
        return (
          <Select
            title={field.title}
            options={field.options || []}
            placeholder="Select an option..."
            disabled={true}
          />
        );
      case "date":
        return (
          <DatePicker
            label={field.title}
            min={field.minDate}
            max={field.maxDate}
            disabled={true}
          />
        );
      case "file":
        return <FileUpload label={field.title} disabled={true} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-lg border-2 p-4 transition-all duration-200
        ${isSelected ? "border-gray-900 shadow-lg" : "border-gray-200 hover:border-gray-300"}
        ${isDragging ? "opacity-50 shadow-xl z-50" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 z-10"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors z-10"
      >
        <svg
          className="w-5 h-5"
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

      <div className="ml-8 mr-8 pointer-events-none">
        {field.type === "radio" && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.title}
          </label>
        )}

        {field.subtitle && (
          <p className="text-xs text-gray-500 mb-2">{field.subtitle}</p>
        )}

        {renderFieldInput()}
      </div>

      <div className="mt-3 ml-8 flex items-center gap-2">
        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
          {field.type}
        </span>
        {field.required && (
          <span className="inline-block px-2 py-1 text-xs bg-red-50 text-red-600 rounded">
            Required
          </span>
        )}
      </div>
    </div>
  );
}
