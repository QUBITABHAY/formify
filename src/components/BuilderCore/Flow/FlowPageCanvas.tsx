import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FlowCard from "./FlowCard";
import type {
  FormFieldConfig,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
} from "../shared/types";

interface FlowPageCanvasProps {
  fields: FormFieldConfig[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  welcomeScreen: WelcomeScreenConfig;
  thankYouScreen: ThankYouScreenConfig;
  onSelectWelcome: () => void;
  onSelectThankYou: () => void;
}

export default function FlowPageCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  welcomeScreen,
  thankYouScreen,
  onSelectWelcome,
  onSelectThankYou,
}: FlowPageCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 overflow-y-auto p-8"
      onClick={() => onSelectField(null)}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectWelcome();
          }}
          className={`
            bg-white rounded-xl border-2 p-8 cursor-pointer transition-all duration-200 group
            ${selectedFieldId === "WELCOME" ? "border-gray-900 shadow-xl ring-2 ring-gray-100" : "border-gray-200 hover:border-gray-900 hover:shadow-lg"}
          `}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {welcomeScreen.title}
          </h2>
          <p className="text-gray-600 mb-4">{welcomeScreen.description}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
            {welcomeScreen.buttonText}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 min-h-[100px] relative">
            {fields.length > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 ml-[9px] -z-10" />
            )}

            {fields.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  Drag and drop fields here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Each field becomes a step in your flow
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <FlowCard
                  key={field.id}
                  field={field}
                  stepNumber={index + 1}
                  isSelected={selectedFieldId === field.id}
                  onClick={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))
            )}
          </div>
        </SortableContext>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectThankYou();
          }}
          className={`
            bg-white rounded-xl border-2 p-8 cursor-pointer transition-all duration-200 group
            ${selectedFieldId === "THANKYOU" ? "border-gray-900 shadow-xl ring-2 ring-gray-100" : "border-gray-200 hover:border-gray-900 hover:shadow-lg"}
          `}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {thankYouScreen.title} {thankYouScreen.emoji}
            </h2>
            <p className="text-gray-600">{thankYouScreen.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
