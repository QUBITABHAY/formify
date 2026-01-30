import type {
  FormFieldConfig,
  WelcomeScreenConfig,
  ThankYouScreenConfig,
  FormMode,
} from "./types";
import FlowPage from "../../../layouts/FlowPage";
import SinglePage from "../../../layouts/SinglePage";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormMode;
  fields: FormFieldConfig[];
  welcomeScreen: WelcomeScreenConfig;
  thankYouScreen: ThankYouScreenConfig;
  formTitle: string;
  formDescription: string;
  formBanner: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  mode,
  fields,
  welcomeScreen,
  thankYouScreen,
  formTitle,
  formDescription,
  formBanner,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const layoutFields = fields.map((field) => ({
    id: field.id,
    type: field.type as
      | "text"
      | "number"
      | "email"
      | "tel"
      | "radio"
      | "checkbox",
    title: field.title,
    subtitle: field.subtitle,
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    options: field.options,
    defaultValue: field.defaultValue,
    name: field.name,
    required: field.required,
    multiSelect: field.multiSelect,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-5xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-gray-700 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
        >
          <svg
            className="w-6 h-6"
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

        <div className="flex-1 overflow-hidden">
          {mode === "flow" ? (
            <FlowPage
              formTitle={formTitle}
              formDescription={formDescription}
              fields={layoutFields}
              welcomeScreen={{
                title: welcomeScreen.title,
                description: welcomeScreen.description,
                buttonText: welcomeScreen.buttonText,
              }}
              thankYouScreen={{
                title: thankYouScreen.title,
                description: thankYouScreen.description,
                emoji: thankYouScreen.emoji,
              }}
              onSubmit={(data) => console.log("Preview submitted:", data)}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <SinglePage
                formTitle={formTitle}
                formDescription={formDescription}
                formBanner={formBanner}
                fields={layoutFields}
                onSubmit={(data) => console.log("Preview submitted:", data)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
