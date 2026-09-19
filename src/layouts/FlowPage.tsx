import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import InputField from "../components/common/InputField";
import Checkbox from "../components/common/Checkbox";
import RadioButton from "../components/common/RadioButton";
import Button from "../components/common/Button";
import DatePicker from "../components/common/DatePicker";
import TimePicker from "../components/common/TimePicker";
import FileUpload from "../components/common/FileUpload";
import Select from "../components/common/Select";
import TextArea from "../components/common/TextArea";
import Rating from "../components/common/Rating";
import type {
  FormFieldConfig as FormField,
  ConditionalRule,
  QuizResult,
} from "../components/BuilderCore/shared/types";
import { uploadFile } from "../services/api";
import { validateField } from "../utils/validation";
import { isAnswerCorrect } from "../components/BuilderCore/shared/quizUtils";

const normalizeFieldType = (type: unknown): string => {
  if (typeof type !== "string") return "text";

  const normalized = type.trim().toLowerCase();
  if (
    ["long text", "longtext", "long-text", "long_text"].includes(normalized)
  ) {
    return "textarea";
  }
  if (normalized === "dropdown") {
    return "select";
  }
  return normalized;
};

const evaluateRule = (rule: ConditionalRule, value: unknown): boolean => {
  const strValue = Array.isArray(value) ? value.join(",") : String(value ?? "");
  const ruleValue = rule.value;
  switch (rule.operator) {
    case "equals":
      return strValue === ruleValue;
    case "not_equals":
      return strValue !== ruleValue;
    case "contains":
      if (Array.isArray(value)) return value.includes(ruleValue);
      return strValue.toLowerCase().includes(ruleValue.toLowerCase());
    case "not_contains":
      if (Array.isArray(value)) return !value.includes(ruleValue);
      return !strValue.toLowerCase().includes(ruleValue.toLowerCase());
    default:
      return false;
  }
};

const getAutoComplete = (field: FormField): string | undefined => {
  const title = (field.title || "").toLowerCase();
  const type = field.type?.toLowerCase();

  if (type === "email" || title.includes("email")) return "email";
  if (type === "tel" || title.includes("phone") || title.includes("mobile"))
    return "tel";
  if (title.includes("first name") || title.includes("given name"))
    return "given-name";
  if (
    title.includes("last name") ||
    title.includes("surname") ||
    title.includes("family name")
  )
    return "family-name";
  if (title.includes("name") || title.includes("full name")) return "name";
  if (title.includes("street") || title.includes("address"))
    return "street-address";
  if (title.includes("city")) return "address-level2";
  if (
    title.includes("zip") ||
    title.includes("postal") ||
    title.includes("pincode")
  )
    return "postal-code";
  if (title.includes("country")) return "country-name";
  if (title.includes("organization") || title.includes("company"))
    return "organization";
  return undefined;
};

const getInputMode = (
  type: string,
): "email" | "tel" | "numeric" | "text" | undefined => {
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  if (type === "number") return "numeric";
  return undefined;
};

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
  formId?: string | number;
  formTitle?: string;
  formDescription?: string;
  fields?: FormField[];
  onSubmit?: (data: Record<string, unknown>) => Promise<{
    quiz_result?: QuizResult;
    quizResult?: QuizResult;
  } | void> | void;
  accentColor?: string;
  welcomeScreen?: WelcomeScreenProps;
  thankYouScreen?: ThankYouScreenProps;
  isQuiz?: boolean;
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
  formId,
  isQuiz = false,
}: FlowPageProps) {
  const {
    welcomeTitle,
    welcomeDescription,
    welcomeButtonText,
    thankYouTitle,
    thankYouDescription,
    thankYouEmoji,
  } = useMemo(
    () => ({
      welcomeTitle: welcomeScreen.title || formTitle,
      welcomeDescription: welcomeScreen.description || formDescription,
      welcomeButtonText: welcomeScreen.buttonText || "Start",
      thankYouTitle: thankYouScreen.title || "Thank you!",
      thankYouDescription:
        thankYouScreen.description ||
        "Your response has been submitted successfully. We'll be in touch soon.",
      thankYouEmoji: thankYouScreen.emoji || "🎉",
    }),
    [welcomeScreen, thankYouScreen, formTitle, formDescription],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.type === "radio" && field.multiSelect) {
        initialData[field.id] = Array.isArray(field.defaultValue)
          ? field.defaultValue
          : [];
      } else {
        initialData[field.id] = field.defaultValue;
      }
    });
    return initialData;
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<number[]>([]);
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(
    new Set(),
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const totalSteps = fields.length;
  const isIntroScreen = currentStep === -1;
  const currentField = fields[currentStep];

  const getNextStep = useCallback(
    (fromStep: number): number | "SUBMIT" => {
      const field = fields[fromStep];
      if (field?.logic?.rules && field.logic.rules.length > 0) {
        const value = formData[field.id];
        for (const rule of field.logic.rules) {
          if (rule.targetFieldId && evaluateRule(rule, value)) {
            if (rule.targetFieldId === "SUBMIT") return "SUBMIT";
            const targetIndex = fields.findIndex(
              (f) => f.id === rule.targetFieldId,
            );
            if (targetIndex !== -1) return targetIndex;
          }
        }
      }
      return fromStep + 1;
    },
    [fields, formData],
  );

  useEffect(() => {
    setCurrentStep(-1);
  }, []);

  useEffect(() => {
    setUploadError(null);
    containerRef.current?.focus();
    const timer = setTimeout(() => {
      if (
        currentField &&
        ["text", "email", "tel", "number", "textarea"].includes(
          currentField.type,
        )
      ) {
        inputRef.current?.focus();
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [currentStep, currentField]);

  const handleFieldChange = useCallback((id: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleFileUpload = useCallback(
    async (fieldId: string, file: File) => {
      if (!formId) {
        setUploadError("File upload failed: form configuration error.");
        return;
      }

      setUploadError(null);
      setUploadingFields((prev) => new Set(prev).add(fieldId));
      try {
        const response = await uploadFile(formId, file);
        handleFieldChange(fieldId, response.url);
      } catch (err) {
        const errorData = err as {
          response?: { data?: { error?: string; message?: string } };
        };
        setUploadError(
          errorData.response?.data?.error ||
            errorData.response?.data?.message ||
            "File upload failed. Please try again.",
        );
      } finally {
        setUploadingFields((prev) => {
          const next = new Set(prev);
          next.delete(fieldId);
          return next;
        });
      }
    },
    [formId, handleFieldChange],
  );

  const canProceed = useCallback(() => {
    if (isIntroScreen) return true;
    if (!currentField) return false;
    if (uploadingFields.has(currentField.id)) return false;
    return validateField(currentField, formData[currentField.id]) === null;
  }, [isIntroScreen, currentField, uploadingFields, formData]);

  const handleSubmit = useCallback(async () => {
    try {
      const submitRes = await onSubmit?.(formData);
      if (isQuiz) {
        const serverResult =
          (
            submitRes as
              | { quiz_result?: QuizResult; quizResult?: QuizResult }
              | undefined
          )?.quiz_result ||
          (
            submitRes as
              | { quiz_result?: QuizResult; quizResult?: QuizResult }
              | undefined
          )?.quizResult;

        if (serverResult && serverResult.maxScore > 0) {
          setQuizResult(serverResult);
        } else {
          const scorableFields = fields.filter(
            (f) =>
              f.correctAnswer !== undefined &&
              f.correctAnswer !== null &&
              f.correctAnswer !== "",
          );
          let totalScore = 0;
          let maxScore = 0;
          const fieldResults = scorableFields.map((f) => {
            const pts = f.points ?? 1;
            maxScore += pts;
            const userAnswer = formData[f.id] as string | string[] | undefined;
            const isCorrect = isAnswerCorrect(
              userAnswer,
              f.correctAnswer as string | string[] | undefined,
              f.options,
            );
            const earned = isCorrect ? pts : 0;
            totalScore += earned;
            return {
              fieldId: f.id,
              title: f.title,
              correct: isCorrect,
              earnedPoints: earned,
              maxPoints: pts,
              userAnswer,
              correctAnswer: f.correctAnswer,
            };
          });
          if (fieldResults.length > 0) {
            setQuizResult({ score: totalScore, maxScore, fieldResults });
          } else if (serverResult) {
            setQuizResult(serverResult);
          }
        }
      }
      setIsSubmitted(true);
    } catch {
      // Error is handaled by parent
    }
  }, [onSubmit, formData, isQuiz, fields]);

  const goToNext = useCallback(() => {
    if (!canProceed() || isAnimating) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const advanceStep = () => {
      if (isIntroScreen) {
        setNavigationHistory([]);
        setCurrentStep(0);
      } else {
        const nextStep = getNextStep(currentStep);
        if (
          nextStep === "SUBMIT" ||
          (typeof nextStep === "number" && nextStep >= totalSteps)
        ) {
          setNavigationHistory((prev) => [...prev, currentStep]);
          handleSubmit();
        } else {
          setNavigationHistory((prev) => [...prev, currentStep]);
          setCurrentStep(nextStep as number);
        }
      }
    };

    if (prefersReducedMotion) {
      advanceStep();
      return;
    }

    setDirection("down");
    setIsAnimating(true);

    setTimeout(() => {
      advanceStep();
      setIsAnimating(false);
    }, 300);
  }, [
    canProceed,
    isAnimating,
    isIntroScreen,
    getNextStep,
    currentStep,
    totalSteps,
    handleSubmit,
  ]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    if (navigationHistory.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stepBack = () => {
      const prevStep = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCurrentStep(prevStep);
    };

    if (prefersReducedMotion) {
      stepBack();
      return;
    }

    setDirection("up");
    setIsAnimating(true);

    setTimeout(() => {
      stepBack();
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, navigationHistory]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goToNext();
      }
    },
    [goToNext],
  );

  const validationError = useMemo(() => {
    if (isIntroScreen || !currentField) return null;
    return validateField(currentField, formData[currentField.id]);
  }, [isIntroScreen, currentField, formData]);

  const renderField = (field: FormField) => {
    const fieldType = normalizeFieldType(field.type);

    switch (fieldType) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <div className="w-full max-w-lg">
            <InputField
              key={field.id}
              ref={inputRef as MutableRefObject<HTMLInputElement>}
              id={`flow-field-${field.id}`}
              name={field.name || field.id}
              title=""
              type={fieldType}
              placeholder={field.placeholder}
              value={(formData[field.id] as string | number | undefined) ?? ""}
              subtitle={field.subtitle}
              autoComplete={getAutoComplete(field)}
              inputMode={getInputMode(fieldType)}
              required={field.required}
              error={validationError || undefined}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="w-full max-w-lg">
            <TextArea
              ref={inputRef as MutableRefObject<HTMLTextAreaElement>}
              id={`flow-field-${field.id}`}
              name={field.name || field.id}
              title=""
              placeholder={field.placeholder}
              value={(formData[field.id] as string) ?? ""}
              maxLength={field.maxLength}
              subtitle={field.subtitle}
              required={field.required}
              error={validationError || undefined}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        );
      case "radio":
        if (field.multiSelect) {
          const selectedValues = (formData[field.id] as string[]) || [];
          return (
            <div className="flex flex-col gap-3 w-full max-w-lg">
              {field.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  title={option.label}
                  checked={selectedValues.includes(option.value)}
                  onChange={(checked: boolean) => {
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
              subtitle={field.subtitle}
              checked={formData[field.id] as boolean}
              onChange={(checked: boolean) =>
                handleFieldChange(field.id, checked)
              }
            />
          </div>
        );
      case "date":
        return (
          <div className="w-full max-w-lg">
            <DatePicker
              label=""
              name={field.id}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              min={field.minDate}
              max={field.maxDate}
              subtitle={field.subtitle}
            />
          </div>
        );
      case "time":
        return (
          <div className="w-full max-w-lg">
            <TimePicker
              label=""
              name={field.id}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              min={field.minTime}
              max={field.maxTime}
              subtitle={field.subtitle}
            />
          </div>
        );
      case "file":
        return (
          <div className="w-full max-w-lg">
            <FileUpload
              label=""
              name={field.id}
              value={(formData[field.id] as string) || ""}
              isUploading={uploadingFields.has(field.id)}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(field.id, file);
                }
              }}
              subtitle={field.subtitle}
            />
          </div>
        );
      case "select":
        return (
          <div className="w-full max-w-lg">
            <Select
              id={`flow-field-${field.id}`}
              name={field.name || field.id}
              title=""
              options={field.options || []}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              subtitle={field.subtitle}
              placeholder={field.placeholder || "Select an option"}
              required={field.required}
              error={validationError || undefined}
            />
          </div>
        );
      case "rating":
        return (
          <div className="w-full max-w-lg">
            <Rating
              label=""
              maxRating={field.maxRating}
              ratingSymbol={field.ratingSymbol}
              value={(formData[field.id] as number) || 0}
              onChange={(val: number) => handleFieldChange(field.id, val)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    if (isQuiz && quizResult) {
      const percentage =
        quizResult.maxScore > 0
          ? Math.round((quizResult.score / quizResult.maxScore) * 100)
          : 0;
      const passed = percentage >= 50;
      return (
        <div className="flex flex-col min-h-screen bg-gray-50 py-10 px-4 md:px-6">
          <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
              <div className="h-2 bg-gray-900" />
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-4xl">{passed ? "🎉" : "💪"}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {thankYouTitle ||
                    (passed ? "Great job!" : "Keep practicing!")}
                </h1>
                <p className="text-gray-500 mb-6">
                  {thankYouDescription ||
                    (passed
                      ? "You've successfully completed the quiz."
                      : "Review your answers below to learn more.")}
                </p>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">
                      {percentage}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {quizResult.score} / {quizResult.maxScore} points
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-xs mx-auto h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {quizResult.fieldResults.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-800">
                    Question Breakdown
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {quizResult.fieldResults.map((r) => {
                    const qField = fields.find((f) => f.id === r.fieldId);
                    const getLabel = (val: string | string[] | undefined) => {
                      if (
                        val === undefined ||
                        val === null ||
                        val === "" ||
                        (Array.isArray(val) && val.length === 0)
                      )
                        return "-";
                      if (!qField?.options) return String(val);

                      const values = Array.isArray(val) ? val : [String(val)];
                      const labels = values.map(
                        (v) =>
                          qField.options?.find((o) => o.value === v)?.label ??
                          v,
                      );
                      return labels.join(", ");
                    };
                    return (
                      <div
                        key={r.fieldId}
                        className="px-6 py-4 flex items-start gap-4"
                      >
                        <div
                          className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            r.correct ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {r.correct ? (
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Your answer:{" "}
                            <span
                              className={
                                r.correct
                                  ? "text-green-700 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {getLabel(r.userAnswer)}
                            </span>
                          </p>
                          {!r.correct && (
                            <p className="text-xs text-gray-500">
                              Correct answer:{" "}
                              <span className="text-green-700 font-medium">
                                {getLabel(r.correctAnswer)}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-semibold ${
                              r.correct ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {r.earnedPoints}/{r.maxPoints}
                          </span>
                          <p className="text-xs text-gray-400">pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
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
          <p className="text-xl text-gray-600 max-w-md mx-auto whitespace-pre-line">
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
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 outline-none"
      >
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {welcomeTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed whitespace-pre-line">
            {welcomeDescription}
          </p>
          <div className="flex justify-center">
            <Button
              title={welcomeButtonText}
              onClick={goToNext}
              bgColor="bg-gray-900 hover:bg-black"
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
      className="min-h-screen flex flex-col bg-gray-50 outline-none"
    >
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div
          className={`w-full max-w-2xl motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 transition-all duration-300 ${
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
            <p className="text-xl text-gray-500 mb-8">
              {currentField.subtitle}
            </p>
          )}

          <div className="mb-6">
            {currentField && renderField(currentField)}
          </div>

          {validationError && (
            <p role="alert" className="text-red-500 text-sm mb-4">
              {validationError}
            </p>
          )}
          {uploadError && (
            <p role="alert" className="text-red-500 text-sm mb-4">
              {uploadError}
            </p>
          )}

          {currentStep === totalSteps - 1 ||
          getNextStep(currentStep) === "SUBMIT" ||
          (typeof getNextStep(currentStep) === "number" &&
            (getNextStep(currentStep) as number) >= totalSteps) ? (
            <Button
              title="Submit"
              onClick={goToNext}
              bgColor={
                canProceed()
                  ? "bg-gray-900 hover:bg-black"
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
          disabled={navigationHistory.length === 0}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
            navigationHistory.length > 0
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
        {currentStep !== totalSteps - 1 &&
          getNextStep(currentStep) !== "SUBMIT" && (
            <button
              onClick={goToNext}
              disabled={!canProceed()}
              className={`md:hidden inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-200 ${
                canProceed()
                  ? "bg-gray-900 hover:bg-black"
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
