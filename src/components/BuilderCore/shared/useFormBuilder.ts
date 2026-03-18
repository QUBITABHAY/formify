import { useState, useCallback } from "react";
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { publishForm, unpublishForm } from "../../../services/api";
import type { FormFieldConfig, FieldTemplate } from "./types";

function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface UseFormBuilderProps {
  formId?: number;
  initialFields: FormFieldConfig[];
  initialIsPublished: boolean;
  initialShareUrl?: string | null;
  onSave?: (fields: FormFieldConfig[]) => Promise<boolean>;
  validateBeforeSave?: () => string | null;
}

export function useFormBuilder({
  formId,
  initialFields,
  initialIsPublished,
  initialShareUrl,
  onSave,
  validateBeforeSave,
}: UseFormBuilderProps) {
  const [fields, setFields] = useState<FormFieldConfig[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [shareUrl, setShareUrl] = useState<string>(initialShareUrl ?? "");
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSave = useCallback(async () => {
    if (!onSave) return false;

    const validationMessage = validateBeforeSave?.();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return false;
    }

    setIsSaving(true);
    try {
      const success = await onSave(fields);
      return success;
    } finally {
      setIsSaving(false);
    }
  }, [onSave, fields, validateBeforeSave]);

  const handlePublish = useCallback(async () => {
    if (!formId) return;

    const saved = await handleSave();
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
      setErrorMessage("Failed to publish form.");
    } finally {
      setIsPublishing(false);
    }
  }, [formId, handleSave]);

  const handleUnpublish = useCallback(async () => {
    if (!formId) return;
    setShowUnpublishConfirm(false);

    try {
      const result = await unpublishForm(formId);
      setIsPublished(result.status === "published");
    } catch {
      setErrorMessage("Failed to unpublish form.");
    }
  }, [formId]);

  return {
    fields,
    setFields,
    selectedFieldId,
    setSelectedFieldId,
    activeId,
    showPreview,
    setShowPreview,
    isSaving,
    showShareModal,
    setShowShareModal,
    isPublishing,
    isPublished,
    shareUrl,
    showUnpublishConfirm,
    setShowUnpublishConfirm,
    errorMessage,
    setErrorMessage,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleUpdateField,
    handleDeleteField,
    handleSave,
    handlePublish,
    handleUnpublish,
  };
}
