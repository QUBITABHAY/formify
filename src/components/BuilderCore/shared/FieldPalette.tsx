import { useDraggable } from "@dnd-kit/core";
import { FIELD_TEMPLATES } from "./constants";
import type { FieldTemplate } from "./types";

interface DraggablePaletteItemProps {
  template: FieldTemplate;
}

function DraggablePaletteItem({ template }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${template.type}`,
    data: {
      type: "palette-item",
      template,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200
        cursor-grab active:cursor-grabbing hover:border-gray-900 hover:shadow-md
        transition-all duration-200 select-none
        ${isDragging ? "opacity-50 shadow-lg scale-105" : ""}
      `}
    >
      <span className="text-gray-900">{template.icon}</span>
      <span className="text-sm font-medium text-gray-700">
        {template.label}
      </span>
    </div>
  );
}

export default function FieldPalette() {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Form Fields</h2>
      <p className="text-xs text-gray-500 mb-4">
        Drag fields to build your form
      </p>
      <div className="space-y-2">
        {FIELD_TEMPLATES.map((template) => (
          <DraggablePaletteItem key={template.type} template={template} />
        ))}
      </div>
    </div>
  );
}
