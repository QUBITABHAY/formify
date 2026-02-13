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

interface FlowCardProps {
  field: FormFieldConfig;
  stepNumber: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function FlowCard({
  field,
  stepNumber,
  isSelected,
  onClick,
  onDelete,
}: FlowCardProps) {
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

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <div className="w-full max-w-md">
            <InputField
              title=""
              type={field.type}
              placeholder={field.placeholder}
              disabled={true}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="w-full max-w-md">
            <TextArea
              title=""
              placeholder={field.placeholder}
              rows={2}
              disabled={true}
            />
          </div>
        );
      case "radio":
        return (
          <div className="flex flex-col gap-2 w-full max-w-md">
            {field.options?.slice(0, 3).map((opt, i) => (
              <RadioButton
                key={i}
                title={opt.label}
                name={`preview-${field.id}`}
                value={opt.value}
              />
            ))}
            {(field.options?.length || 0) > 3 && (
              <span className="text-sm text-gray-400">
                +{(field.options?.length || 0) - 3} more options
              </span>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div className="w-full max-w-md">
            <Checkbox title={field.title} />
          </div>
        );
      case "select":
        return (
          <div className="w-full max-w-md">
            <Select
              title=""
              options={field.options || []}
              placeholder="Select an option..."
              disabled={true}
            />
          </div>
        );
      case "date":
        return (
          <div className="w-full max-w-md">
            <DatePicker
              label=""
              min={field.minDate}
              max={field.maxDate}
              disabled={true}
            />
          </div>
        );
      case "file":
        return (
          <div className="w-full max-w-md">
            <FileUpload label="" disabled={true} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-xl border-2 p-6 transition-all duration-200 group
        ${isSelected ? "border-gray-900 shadow-xl ring-2 ring-gray-100" : "border-gray-200 hover:border-gray-900 hover:shadow-lg"}
        ${isDragging ? "opacity-50 shadow-2xl z-50" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 p-1.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 rounded transition-colors"
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
        className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
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

      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
        {stepNumber}
      </div>
      <div className="ml-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {field.title}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {field.subtitle && (
          <p className="text-sm text-gray-500 mb-4">{field.subtitle}</p>
        )}
        <div className="pointer-events-none">{renderFieldPreview()}</div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-900 rounded font-medium">
            {field.type}
          </span>
          {field.required && (
            <span className="inline-block px-2 py-1 text-xs bg-red-50 text-red-600 rounded font-medium">
              Required
            </span>
          )}
          {field.logic && field.logic.rules.length > 0 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-900 rounded font-medium">
              Logic
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
