import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";

import FieldPalette from "../shared/FieldPalette";
import FieldEditor from "../shared/FieldEditor";
import PreviewModal from "../shared/PreviewModal";
import ShareModal from "../../common/ShareModal";
import SinglePageCanvas from "./SinglePageCanvas";
import { updateForm } from "../../../services/api";
import logo from "../../../assets/logo.svg";

import type { FormFieldConfig, ThankYouScreenConfig } from "../shared/types";
import { Icons } from "../../common/icons";
import Modal from "../../common/Modal";
import { useFormBuilder } from "../shared/useFormBuilder";

interface SinglePageFormBuilderProps {
  formId?: number;
  initialFields?: FormFieldConfig[];
  initialTitle?: string;
  initialDescription?: string;
  initialBanner?: string;
  initialThankYou?: ThankYouScreenConfig;
  initialIsPublished?: boolean;
  initialShareUrl?: string | null;
}

export default function SinglePageFormBuilder({
  formId,
  initialFields = [],
  initialTitle = "Registration Form",
  initialDescription = "Please fill out the details below.",
  initialBanner = "https://picsum.photos/800/200",
  initialThankYou = {
    title: "Thank you!",
    description:
      "Your response has been submitted successfully. We'll be in touch soon.",
    emoji: "🎉",
  },
  initialIsPublished = false,
  initialShareUrl,
}: SinglePageFormBuilderProps) {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [formDescription, setFormDescription] = useState(initialDescription);
  const [formBanner, setFormBanner] = useState(initialBanner);
  const [thankYouScreen, setThankYouScreen] =
    useState<ThankYouScreenConfig>(initialThankYou);

  const onSave = useCallback(
    async (fields: FormFieldConfig[]) => {
      if (!formId) return false;
      const schema = {
        type: "single",
        fields,
        formTitle,
        formDescription,
        formBanner,
        thankYouScreen,
      };
      await updateForm(formId, {
        name: formTitle,
        description: formDescription,
        schema,
      });
      return true;
    },
    [formId, formTitle, formDescription, formBanner, thankYouScreen],
  );

  const {
    fields,
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
  } = useFormBuilder({
    formId,
    initialFields,
    initialIsPublished,
    initialShareUrl,
    onSave,
    validateBeforeSave: () => {
      if (!formTitle.trim()) {
        return "Form title is required.";
      }
      return null;
    },
  });

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) || null,
    [fields, selectedFieldId],
  );

  const selectedScreen = useMemo(
    () =>
      selectedFieldId === "HEADER"
        ? "HEADER"
        : selectedFieldId === "THANKYOU"
          ? "THANKYOU"
          : null,
    [selectedFieldId],
  );

  const handleUpdateFormMetadata = useCallback(
    (updates: { title?: string; description?: string; banner?: string }) => {
      if (updates.title !== undefined) setFormTitle(updates.title);
      if (updates.description !== undefined)
        setFormDescription(updates.description);
      if (updates.banner !== undefined) setFormBanner(updates.banner);
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
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icons.ArrowLeft />
          </div>
          <img src={logo} alt="Formify" className="w-8 h-8" />
          <div>
            <div className="group relative flex items-center">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent hover:bg-gray-50 focus:bg-white border-transparent hover:border-gray-200 focus:border-gray-300 border rounded-md px-2 py-0.5 -ml-2 outline-none transition-all cursor-text min-w-[200px]"
                placeholder="Enter form title..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {fields.length} fields
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {isPublished ? (
            <button
              onClick={() => setShowUnpublishConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors disabled:opacity-50"
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
          <FieldPalette mode="single" />

          <SinglePageCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onDeleteField={handleDeleteField}
            formDescription={formDescription}
            formBanner={formBanner}
            thankYouScreen={thankYouScreen}
            onSelectHeader={() => setSelectedFieldId("HEADER")}
            onSelectThankYou={() => setSelectedFieldId("THANKYOU")}
          />

          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-gray-900 opacity-90">
                <span className="text-sm font-medium text-gray-700">
                  Adding new field...
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <FieldEditor
          key={selectedFieldId || "none"}
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
          thankYouScreen={thankYouScreen}
          onUpdateWelcome={() => {}}
          onUpdateThankYou={handleUpdateThankYou}
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
        thankYouScreen={thankYouScreen}
      />
      {formId && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareUrl={shareUrl}
        />
      )}

      <Modal
        isOpen={showUnpublishConfirm}
        onClose={() => setShowUnpublishConfirm(false)}
        title="Unpublish Form?"
      >
        <p className="text-sm text-gray-600 mb-6">
          This form will no longer be accessible to the public. You can
          re-publish it later.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setShowUnpublishConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUnpublish}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Unpublish
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        title="Error"
      >
        <p className="text-sm text-gray-600">{errorMessage}</p>
      </Modal>
    </div>
  );
}
