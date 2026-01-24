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
import FlowPageCanvas from "./FlowPageCanvas";

import type {
  FormFieldConfig,
  FieldTemplate,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
} from "../shared/types";

function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function FlowFormBuilder() {
  const [fields, setFields] = useState<FormFieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [welcomeScreen, setWelcomeScreen] = useState<WelcomeScreenConfig>({
    title: "Welcome!",
    description:
      "Let's get to know you better. This will only take a few minutes.",
    buttonText: "Start",
  });

  const [thankYouScreen, setThankYouScreen] = useState<ThankYouScreenConfig>({
    title: "Thank you!",
    description:
      "Your response has been submitted successfully. We'll be in touch soon.",
    emoji: "🎉",
  });

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
  const selectedScreen =
    selectedFieldId === "WELCOME"
      ? "WELCOME"
      : selectedFieldId === "THANKYOU"
        ? "THANKYOU"
        : null;

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

  const handleUpdateWelcome = useCallback(
    (updates: Partial<WelcomeScreenConfig>) => {
      setWelcomeScreen((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const handleUpdateThankYou = useCallback(
    (updates: Partial<ThankYouScreenConfig>) => {
      setThankYouScreen((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Formify" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Flow Builder
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

          <FlowPageCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onDeleteField={handleDeleteField}
            welcomeScreen={welcomeScreen}
            thankYouScreen={thankYouScreen}
            onSelectWelcome={() => setSelectedFieldId("WELCOME")}
            onSelectThankYou={() => setSelectedFieldId("THANKYOU")}
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
          mode="flow"
          selectedScreen={selectedScreen}
          welcomeScreen={welcomeScreen}
          thankYouScreen={thankYouScreen}
          onUpdateWelcome={handleUpdateWelcome}
          onUpdateThankYou={handleUpdateThankYou}
          formMetadata={{ title: "", description: "", banner: "" }}
          onUpdateMetadata={() => {}}
        />
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        mode="flow"
        fields={fields}
        welcomeScreen={welcomeScreen}
        thankYouScreen={thankYouScreen}
        formTitle=""
        formDescription=""
        formBanner=""
      />
    </div>
  );
}
