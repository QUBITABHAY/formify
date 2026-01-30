import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import InputField from "../components/common/InputField";
import Checkbox from "../components/common/Checkbox";
import RadioButton from "../components/common/RadioButton";
import Button from "../components/common/Button";
import type { FormFieldConfig as FormField } from "../components/BuilderCore/shared/types";

interface WelcomeScreenProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

interface ThankYouScreenProps {
  title?: string;
  description?: string;
  emoji?: string;
}

interface FlowPageProps {
  formTitle?: string;
  formDescription?: string;
  fields?: FormField[];
  onSubmit?: (data: Record<string, any>) => void;
  accentColor?: string;
  welcomeScreen?: WelcomeScreenProps;
  thankYouScreen?: ThankYouScreenProps;
}

const defaultFields: FormField[] = [
  {
    id: "fullName",
    type: "text",
    title: "What's your name?",
    subtitle: "We'd love to get to know you.",
    placeholder: "Type your full name here...",
    required: true,
    defaultValue: "",
  },
  {
    id: "email",
    type: "email",
    title: "What's your email address?",
    subtitle: "We'll use this to send you updates.",
    placeholder: "name@company.com",
    required: true,
    defaultValue: "",
  },
  {
    id: "phone",
    type: "tel",
    title: "Your phone number?",
    subtitle: "Optional, but helps us reach you faster.",
    placeholder: "Enter your phone number",
    maxLength: 10,
    defaultValue: "",
  },
  {
    id: "gender",
    type: "radio",
    title: "How do you identify?",
    name: "gender",
    defaultValue: "",
    required: true,
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Non-binary", value: "Non-binary" },
      { label: "Prefer not to say", value: "Prefer not to say" },
    ],
  },
  {
    id: "terms",
    type: "checkbox",
    title: "Accept Terms & Conditions",
    subtitle: "Please read and accept our terms to continue.",
    required: true,
    defaultValue: false,
  },
  {
    id: "newsletter",
    type: "checkbox",
    title: "Subscribe to our newsletter?",
    subtitle: "Get the latest updates and offers.",
    defaultValue: false,
  },
];

function FlowPage({
  formTitle = "Welcome!",
  formDescription = "Let's get to know you better.",
  fields = defaultFields,
  onSubmit,
  welcomeScreen = {},
  thankYouScreen = {},
}: FlowPageProps) {
  const welcomeTitle = welcomeScreen.title || formTitle;
  const welcomeDescription = welcomeScreen.description || formDescription;
  const welcomeButtonText = welcomeScreen.buttonText || "Start";
  const thankYouTitle = thankYouScreen.title || "Thank you!";
  const thankYouDescription =
    thankYouScreen.description ||
    "Your response has been submitted successfully. We'll be in touch soon.";
  const thankYouEmoji = thankYouScreen.emoji || "🎉";
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue;
    });
    return initialData;
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalSteps = fields.length;
  const isIntroScreen = currentStep === -1;
  const currentField = fields[currentStep];

  useEffect(() => {
    setCurrentStep(-1);
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
    const timer = setTimeout(() => {
      if (
        currentField &&
        ["text", "email", "tel", "number"].includes(currentField.type)
      ) {
        inputRef.current?.focus();
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [currentStep, currentField]);

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required) {
      if (field.type === "checkbox" && value !== true) {
        return "This field is required";
      }
      if (typeof value === "string" && value.trim() === "") {
        return "This field is required";
      }
      if (value === undefined || value === null || value === "") {
        return "This field is required";
      }
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "tel" && value) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        return "Please enter a valid 10-digit phone number";
      }
    }

    return null;
  };

  const canProceed = () => {
    if (isIntroScreen) return true;
    const field = currentField;
    if (!field) return false;
    return validateField(field, formData[field.id]) === null;
  };

  const getValidationError = (): string | null => {
    if (isIntroScreen || !currentField) return null;
    return validateField(currentField, formData[currentField.id]);
  };

  const goToNext = () => {
    if (!canProceed() || isAnimating) return;

    setDirection("down");
    setIsAnimating(true);

    setTimeout(() => {
      if (isIntroScreen) {
        setCurrentStep(0);
      } else if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
      setIsAnimating(false);
    }, 300);
  };

  const goToPrevious = () => {
    if (isAnimating || currentStep <= 0) return;

    setDirection("up");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
    setIsSubmitted(true);
    onSubmit?.(formData);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToNext();
    }
  };

  const validationError = getValidationError();

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <div className="w-full max-w-lg">
            <InputField
              ref={inputRef}
              title=""
              type={field.type}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              value={formData[field.id]}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        );
      case "radio":
        if (field.multiSelect) {
          const selectedValues = Array.isArray(formData[field.id])
            ? formData[field.id]
            : [];
          return (
            <div className="flex flex-col gap-3 w-full max-w-lg">
              {field.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  title={option.label}
                  checked={selectedValues.includes(option.value)}
                  onChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(
                          (v: string) => v !== option.value,
                        );
                    handleFieldChange(field.id, newValues);
                  }}
                />
              ))}
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-3 w-full max-w-lg">
            {field.options?.map((option) => (
              <RadioButton
                key={option.value}
                title={option.label}
                name={field.name || field.id}
                value={option.value}
                checked={formData[field.id] === option.value}
                onChange={(val) => handleFieldChange(field.id, val)}
              />
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="w-full max-w-lg">
            <Checkbox
              title={field.title}
              checked={formData[field.id]}
              onChange={(checked) => handleFieldChange(field.id, checked)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {thankYouTitle} {thankYouEmoji}
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            {thankYouDescription}
          </p>
        </div>
      </div>
    );
  }

  if (isIntroScreen) {
    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 outline-none"
      >
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {welcomeTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            {welcomeDescription}
          </p>
          <div className="flex justify-center">
            <Button
              title={welcomeButtonText}
              onClick={goToNext}
              bgColor="bg-indigo-500 hover:bg-indigo-600"
            />
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
              Enter ↵
            </kbd>{" "}
            to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 outline-none"
    >
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            isAnimating
              ? direction === "down"
                ? "opacity-0 -translate-y-8"
                : "opacity-0 translate-y-8"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {currentField?.title}
            {currentField?.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h2>

          {currentField?.subtitle && (
            <p className="text-lg text-gray-500 mb-8">
              {currentField.subtitle}
            </p>
          )}

          <div className="mb-6">
            {currentField && renderField(currentField)}
          </div>

          {validationError && (
            <p className="text-red-500 text-sm mb-4">{validationError}</p>
          )}

          {currentStep === totalSteps - 1 ? (
            <Button
              title="Submit"
              onClick={goToNext}
              bgColor={
                canProceed()
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-gray-300 cursor-not-allowed"
              }
            />
          ) : (
            <span className="hidden md:inline-flex text-sm text-gray-500">
              Press{" "}
              <kbd className="mx-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                Enter ↵
              </kbd>{" "}
              to continue
            </span>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={goToPrevious}
          disabled={currentStep <= 0}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
            currentStep > 0
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Prev
        </button>

        <span className="text-sm text-gray-500">
          {currentStep + 1} of {totalSteps}
        </span>
        {currentStep !== totalSteps - 1 && (
          <button
            onClick={goToNext}
            disabled={!canProceed()}
            className={`md:hidden inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-200 ${
              canProceed()
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Next
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
          </button>
        )}

        {currentStep === totalSteps - 1 && <div className="md:block hidden" />}
      </div>
    </div>
  );
}

export default FlowPage;
