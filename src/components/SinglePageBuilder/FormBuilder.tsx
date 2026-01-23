import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import FieldPalette from "./FieldPalette";
import FormCanvas from "./FormCanvas";
import FieldEditor from "./FieldEditor";

import type { FormFieldConfig, FieldTemplate } from "./types";

function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function FormBuilder() {
  const [fields, setFields] = useState<FormFieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("Registration Form");
  const [formDescription, setFormDescription] = useState(
    "Please fill out the details below.",
  );
  const [formBanner, setFormBanner] = useState("https://picsum.photos/800/200");

  const handleUpdateFormMetadata = useCallback(
    (updates: { title?: string; description?: string; banner?: string }) => {
      if (updates.title !== undefined) setFormTitle(updates.title);
      if (updates.description !== undefined)
        setFormDescription(updates.description);
      if (updates.banner !== undefined) setFormBanner(updates.banner);
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    const activeData = active.data.current;
    if (activeData?.type === "palette-item") {
      const template = activeData.template as FieldTemplate;
      const newField: FormFieldConfig = {
        id: generateId(),
        type: template.type,
        title: template.defaultConfig.title || "Untitled Field",
        placeholder: template.defaultConfig.placeholder,
        maxLength: template.defaultConfig.maxLength,
        options: template.defaultConfig.options,
        defaultValue: template.defaultConfig.defaultValue,
        required: false,
      };
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
      return;
    }

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  }, []);

  const handleUpdateField = useCallback(
    (updates: Partial<FormFieldConfig>) => {
      if (!selectedFieldId) return;
      setFields((prev) =>
        prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f)),
      );
    },
    [selectedFieldId],
  );

  const handleDeleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId((prev) => (prev === id ? null : prev));
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FieldPalette />
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onDeleteField={handleDeleteField}
            formTitle={formTitle}
            formDescription={formDescription}
            formBanner={formBanner}
            onSelectHeader={() => setSelectedFieldId("HEADER")}
          />
          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-500 opacity-80">
                Dragging...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <FieldEditor
          field={selectedField}
          onUpdate={handleUpdateField}
          isHeaderSelected={selectedFieldId === "HEADER"}
          formMetadata={{
            title: formTitle,
            description: formDescription,
            banner: formBanner,
          }}
          onUpdateMetadata={handleUpdateFormMetadata}
        />
      </div>
    </div>
  );
}
