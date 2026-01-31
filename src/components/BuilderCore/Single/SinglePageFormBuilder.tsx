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

import FieldPalette from "../shared/FieldPalette";
import FieldEditor from "../shared/FieldEditor";
import PreviewModal from "../shared/PreviewModal";
import SinglePageCanvas from "./SinglePageCanvas";
import { updateForm } from "../../../services/api";
import logo from "../../../assets/logo.svg";

import type { FormFieldConfig, FieldTemplate } from "../shared/types";

function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface SinglePageFormBuilderProps {
  formId?: number;
  initialFields?: FormFieldConfig[];
  initialTitle?: string;
  initialDescription?: string;
  initialBanner?: string;
}

export default function SinglePageFormBuilder({
  formId,
  initialFields = [],
  initialTitle = "Registration Form",
  initialDescription = "Please fill out the details below.",
  initialBanner = "https://picsum.photos/800/200",
}: SinglePageFormBuilderProps) {
  const [fields, setFields] = useState<FormFieldConfig[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formTitle, setFormTitle] = useState(initialTitle);
  const [formDescription, setFormDescription] = useState(initialDescription);
  const [formBanner, setFormBanner] = useState(initialBanner);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveForm = async () => {
    if (!formId) {
      alert("Form ID not found. Cannot save.");
      return;
    }
    try {
      setIsSaving(true);
      const schema = {
        type: "single",
        fields,
        formTitle,
        formDescription,
        formBanner,
      };
      await updateForm(formId, {
        name: formTitle,
        description: formDescription,
        schema,
      });
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("Failed to save form. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
  const selectedScreen = selectedFieldId === "HEADER" ? "HEADER" : null;

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
        subtitle: template.defaultConfig.subtitle,
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
      if (!selectedFieldId || selectedScreen) return;
      setFields((prev) =>
        prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f)),
      );
    },
    [selectedFieldId, selectedScreen],
  );

  const handleDeleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId((prev) => (prev === id ? null : prev));
  }, []);

  const handleUpdateFormMetadata = useCallback(
    (updates: { title?: string; description?: string; banner?: string }) => {
      if (updates.title !== undefined) setFormTitle(updates.title);
      if (updates.description !== undefined)
        setFormDescription(updates.description);
      if (updates.banner !== undefined) setFormBanner(updates.banner);
    },
    [],
  );

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Formify" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Single Page Builder
            </h1>
            <p className="text-xs text-gray-500">{fields.length} fields</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleSaveForm}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FieldPalette />

          <SinglePageCanvas
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
              <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-indigo-500 opacity-90">
                <span className="text-sm font-medium text-gray-700">
                  Adding new field...
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <FieldEditor
          field={selectedField}
          onUpdate={handleUpdateField}
          mode="single"
          selectedScreen={selectedScreen}
          formMetadata={{
            title: formTitle,
            description: formDescription,
            banner: formBanner,
          }}
          onUpdateMetadata={handleUpdateFormMetadata}
          welcomeScreen={{ title: "", description: "", buttonText: "" }}
          thankYouScreen={{ title: "", description: "", emoji: "" }}
          onUpdateWelcome={() => {}}
          onUpdateThankYou={() => {}}
        />
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        mode="single"
        fields={fields}
        formTitle={formTitle}
        formDescription={formDescription}
        formBanner={formBanner}
        welcomeScreen={{ title: "", description: "", buttonText: "" }}
        thankYouScreen={{ title: "", description: "", emoji: "" }}
      />
    </div>
  );
}
