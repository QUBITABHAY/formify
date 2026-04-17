import { useState, useCallback, useMemo } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";

import FieldPalette from "../shared/FieldPalette";
import FieldEditor from "../shared/FieldEditor";
import PreviewModal from "../shared/PreviewModal";
import ShareModal from "../../common/ShareModal";
import FlowPageCanvas from "./FlowPageCanvas";
import { updateForm } from "../../../services/api";
import logo from "../../../assets/logo.svg";

import type {
  FormFieldConfig,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
} from "../shared/types";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../common/icons";
import Modal from "../../common/Modal";
import { useFormBuilder } from "../shared/useFormBuilder";

interface FlowFormBuilderProps {
  formId?: number;
  initialFields?: FormFieldConfig[];
  initialWelcome?: WelcomeScreenConfig;
  initialThankYou?: ThankYouScreenConfig;
  initialIsPublished?: boolean;
  initialShareUrl?: string | null;
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
  initialShareUrl,
}: FlowFormBuilderProps) {
  const navigate = useNavigate();
  const [welcomeScreen, setWelcomeScreen] =
    useState<WelcomeScreenConfig>(initialWelcome);

  const [thankYouScreen, setThankYouScreen] =
    useState<ThankYouScreenConfig>(initialThankYou);

  const onSave = useCallback(
    async (fields: FormFieldConfig[]) => {
      if (!formId) return false;
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
    },
    [formId, welcomeScreen, thankYouScreen],
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
      if (!welcomeScreen.title.trim()) {
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
      selectedFieldId === "WELCOME"
        ? "WELCOME"
        : selectedFieldId === "THANKYOU"
          ? "THANKYOU"
          : null,
    [selectedFieldId],
  );

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
          <div
            className={`flex items-center gap-2 ${
              isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={async () => {
              if (isSaving) return;
              const saved = await handleSave();
              if (saved) navigate(-1);
            }}
          >
            <Icons.ArrowLeft />
          </div>
          <img src={logo} alt="Formify" className="w-8 h-8" />
          <div>
            <div className="group relative flex items-center">
              <input
                type="text"
                value={welcomeScreen.title}
                onChange={(e) => handleUpdateWelcome({ title: e.target.value })}
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
          <FieldPalette mode="flow" />

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
              <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-gray-900 opacity-90">
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
