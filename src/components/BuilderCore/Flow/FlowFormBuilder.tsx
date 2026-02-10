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
import ShareModal from "../../common/ShareModal";
import FlowPageCanvas from "./FlowPageCanvas";
import { updateForm, publishForm, unpublishForm } from "../../../services/api";
import logo from "../../../assets/logo.svg";

import type {
  FormFieldConfig,
  FieldTemplate,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
} from "../shared/types";

function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface FlowFormBuilderProps {
  formId?: number;
  initialFields?: FormFieldConfig[];
  initialWelcome?: WelcomeScreenConfig;
  initialThankYou?: ThankYouScreenConfig;
  initialIsPublished?: boolean;
}

export default function FlowFormBuilder({
  formId,
  initialFields = [],
  initialWelcome = {
    title: "Welcome!",
    description:
      "Let's get to know you better. This will only take a few minutes.",
    buttonText: "Start",
  },
  initialThankYou = {
    title: "Thank you!",
    description:
      "Your response has been submitted successfully. We'll be in touch soon.",
    emoji: "🎉",
  },
  initialIsPublished = false,
}: FlowFormBuilderProps) {
  const [fields, setFields] = useState<FormFieldConfig[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [welcomeScreen, setWelcomeScreen] =
    useState<WelcomeScreenConfig>(initialWelcome);

  const [thankYouScreen, setThankYouScreen] =
    useState<ThankYouScreenConfig>(initialThankYou);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [shareUrl, setShareUrl] = useState<string>("");

  const handleSaveForm = async () => {
    if (!formId) {
      alert("Form ID not found. Cannot save.");
      return;
    }
    try {
      setIsSaving(true);
      const schema = {
        type: "flow",
        fields,
        welcomeScreen,
        thankYouScreen,
      };
      await updateForm(formId, {
        name: welcomeScreen.title,
        description: welcomeScreen.description,
        schema,
      });
      return true;
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("Failed to save form. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formId) return;

    const saved = await handleSaveForm();
    if (!saved) return;

    try {
      setIsPublishing(true);
      const result = await publishForm(formId);
      setIsPublished(result.status === "published");
      if (result.share_url) {
        setShareUrl(result.share_url);
      }
      setShowShareModal(true);
    } catch (error) {
      console.error("Failed to publish form:", error);
      alert("Failed to publish form.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!formId) return;
    if (
      !confirm(
        "Are you sure you want to unpublish this form? It will no longer be accessible to the public.",
      )
    )
      return;

    try {
      const result = await unpublishForm(formId);
      setIsPublished(result.status === "published");
      alert("Form unpublished successfully.");
    } catch (error) {
      console.error("Failed to unpublish form:", error);
      alert("Failed to unpublish form.");
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
          <img src={logo} alt="Formify" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {welcomeScreen.title || "Conversational Form Builder"}
            </h1>
            <p className="text-xs text-gray-500">{fields.length} fields</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Share
          </button>
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
            {isSaving ? "Saving..." : "Save"}
          </button>
          {isPublished ? (
            <button
              onClick={handleUnpublish}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          )}
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
          allFields={fields}
        />
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        mode="flow"
        fields={fields}
        welcomeScreen={welcomeScreen}
        thankYouScreen={thankYouScreen}
        formTitle={welcomeScreen.title}
        formDescription={welcomeScreen.description}
        formBanner=""
      />
      {formId && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareUrl={shareUrl || formId.toString()}
        />
      )}
    </div>
  );
}
