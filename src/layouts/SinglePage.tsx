import { useState, useEffect, useCallback, useMemo } from "react";
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
  ThankYouScreenConfig,
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

interface SinglePageProps {
  formId?: string | number;
  formTitle?: string;
  formDescription?: string;
  formBanner?: string;
  fields?: FormField[];
  thankYouScreen?: ThankYouScreenConfig;
  onSubmit?: (data: Record<string, unknown>) => void;
  isQuiz?: boolean;
}

const defaultFields: FormField[] = [
  {
    id: "fullName",
    type: "text",
    title: "Full Name",
    placeholder: "Enter your full name",
    defaultValue: "",
  },
  {
    id: "email",
    type: "email",
    title: "Email Address",
    placeholder: "Enter your email",
    defaultValue: "",
  },
  {
    id: "phone",
    type: "tel",
    title: "Phone Number",
    placeholder: "Enter your phone number",
    maxLength: 10,
    defaultValue: "",
  },
  {
    id: "gender",
    type: "radio",
    title: "Gender",
    name: "gender",
    defaultValue: "Male",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    id: "terms",
    type: "checkbox",
    title: "I agree to the Terms and Conditions",
    defaultValue: false,
  },
  {
    id: "newsletter",
    type: "checkbox",
    title: "Subscribe to newsletter",
    defaultValue: true,
  },
];

function SinglePage({
  formTitle = "Registration Form",
  formDescription = "Please fill out the details below.",
  formBanner = "https://picsum.photos/800/200",
  fields = defaultFields,
  thankYouScreen = {
    title: "Your response has been recorded",
    description: "Thank you for submitting the form.",
    emoji: "🎉",
  },
  onSubmit,
  formId,
  isQuiz = false,
}: SinglePageProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(
    new Set(),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const pages = useMemo(() => {
    const p: FormField[][] = [[]];
    fields.forEach((field) => {
      if (field.type === "page_break") {
        if (p[p.length - 1].length > 0) {
          p.push([]);
        }
      } else {
        p[p.length - 1].push(field);
      }
    });
    return p.filter((page) => page.length > 0);
  }, [fields]);

  const currentFields = useMemo(
    () => pages[currentPageIndex] || [],
    [pages, currentPageIndex],
  );
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pages.length - 1;
  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.type === "radio" && field.multiSelect) {
        initialData[field.id] = Array.isArray(field.defaultValue)
          ? field.defaultValue
          : [];
      } else {
        initialData[field.id] = field.defaultValue || "";
      }
    });
    setFormData(initialData);
  }, [fields]);

  const handleFieldChange = useCallback((id: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  }, []);

  const validatePageFields = useCallback(
    (pageFields: FormField[]): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      pageFields.forEach((field) => {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      });

      setErrors((prev) => ({ ...prev, ...newErrors }));
      return isValid;
    },
    [formData],
  );

  const handleFileUpload = useCallback(
    async (fieldId: string, file: File) => {
      if (!formId) {
        setErrors((prev) => ({
          ...prev,
          [fieldId]: "File upload failed: form configuration error.",
        }));
        return;
      }

      setUploadingFields((prev) => new Set(prev).add(fieldId));
      try {
        const response = await uploadFile(formId, file);
        handleFieldChange(fieldId, response.url);
      } catch (err) {
        const errorData = err as {
          response?: { data?: { error?: string; message?: string } };
        };
        const errorMessage =
          errorData.response?.data?.error ||
          errorData.response?.data?.message ||
          "File upload failed. Please try again.";
        setErrors((prev) => ({
          ...prev,
          [fieldId]: errorMessage,
        }));
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

  const handleClearPage = useCallback(() => {
    const newData = { ...formData };
    const newErrors = { ...errors };
    currentFields.forEach((field) => {
      if (field.type === "radio" && field.multiSelect) {
        newData[field.id] = [];
      } else {
        newData[field.id] = field.defaultValue || "";
      }
      delete newErrors[field.id];
    });
    setFormData(newData);
    setErrors(newErrors);
    setSubmitError(null);
  }, [formData, errors, currentFields]);

  const handleNext = useCallback(() => {
    if (uploadingFields.size > 0) return;
    if (validatePageFields(currentFields)) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [uploadingFields.size, validatePageFields, currentFields]);

  const handleBack = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (uploadingFields.size > 0) return;
    if (validatePageFields(currentFields)) {
      try {
        await onSubmit?.(formData);

        // Compute quiz score if quiz mode is enabled
        if (isQuiz) {
          const scorableFields = fields.filter(
            (f) => f.correctAnswer !== undefined && f.points !== undefined,
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
          setQuizResult({ score: totalScore, maxScore, fieldResults });
        }

        setIsSubmitted(true);
      } catch {
        setSubmitError("Form submission failed. Please try again.");
      }
    }
  }, [
    uploadingFields.size,
    validatePageFields,
    currentFields,
    onSubmit,
    formData,
    isQuiz,
    fields,
  ]);

  const renderField = (field: FormField) => {
    const fieldType = normalizeFieldType(field.type);

    switch (fieldType) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <InputField
            title={field.title}
            type={fieldType}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={(formData[field.id] as string | number | undefined) || ""}
            subtitle={field.subtitle}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <TextArea
            title={field.title}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={(formData[field.id] as string) || ""}
            subtitle={field.subtitle}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "radio":
        if (field.multiSelect) {
          const selectedValues = (formData[field.id] as string[]) || [];
          return (
            <div>
              <label className="text-sm font-normal text-gray-700 mb-3 block">
                {field.title}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.subtitle && (
                  <p className="text-base text-gray-500 mt-1 mb-2">
                    {field.subtitle}
                  </p>
                )}
              </label>
              <div className="flex flex-col gap-3">
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
            </div>
          );
        }
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-3 block">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.subtitle && (
                <p className="text-base text-gray-500 mt-1 mb-2">
                  {field.subtitle}
                </p>
              )}
            </label>
            <div className="flex flex-col gap-3">
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
          </div>
        );
      case "checkbox":
        return (
          <Checkbox
            title={field.title}
            subtitle={field.subtitle}
            checked={(formData[field.id] as boolean) || false}
            onChange={(checked: boolean) =>
              handleFieldChange(field.id, checked)
            }
          />
        );
      case "date":
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-2 block">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.subtitle && (
                <p className="text-base text-gray-500 mt-1 mb-2">
                  {field.subtitle}
                </p>
              )}
            </label>
            <DatePicker
              label=""
              name={field.id}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              min={field.minDate}
              max={field.maxDate}
            />
          </div>
        );
      case "time":
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-2 block">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.subtitle && (
                <p className="text-base text-gray-500 mt-1 mb-2">
                  {field.subtitle}
                </p>
              )}
            </label>
            <TimePicker
              label=""
              name={field.id}
              value={(formData[field.id] as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              min={field.minTime}
              max={field.maxTime}
            />
          </div>
        );
      case "file":
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-2 block">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.subtitle && (
                <p className="text-base text-gray-500 mt-1 mb-2">
                  {field.subtitle}
                </p>
              )}
            </label>
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
            />
          </div>
        );
      case "select":
        return (
          <Select
            title={field.title}
            options={field.options || []}
            value={(formData[field.id] as string) || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            subtitle={field.subtitle}
            placeholder={field.placeholder || "Select an option"}
          />
        );
      case "rating":
        return (
          <Rating
            label={field.title}
            subtitle={field.subtitle}
            maxRating={field.maxRating}
            ratingSymbol={field.ratingSymbol}
            value={(formData[field.id] as number) || 0}
            onChange={(val: number) => handleFieldChange(field.id, val)}
          />
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
                  {thankYouScreen?.title ??
                    (passed ? "Great job!" : "Keep practicing!")}
                </h1>
                <p className="text-gray-500 mb-6">
                  {thankYouScreen?.description ??
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
      <div className="flex flex-col min-h-screen bg-gray-50 py-10 px-4 md:px-6">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
            <div className="h-2 bg-gray-900"></div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{thankYouScreen.emoji}</span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {thankYouScreen.title}
              </h1>
              <p className="text-gray-600 text-lg mb-8 whitespace-pre-line">
                {thankYouScreen.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="w-full max-w-3xl mx-auto relative">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
          {formBanner ? (
            <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100">
              <img
                src={formBanner}
                alt="Form Banner"
                className="w-full h-full object-cover block"
              />
            </div>
          ) : null}
          <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              {formTitle}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl whitespace-pre-line">
              {formDescription}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-red-700">
              <span>*Indicates required question.</span>
            </div>
          </div>
        </div>

        {pages.length > 1 && (
          <div className="mt-8 mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {currentFields.map((field: FormField) => (
            <div
              key={field.id}
              className={`bg-white rounded-lg border shadow-md transition-shadow duration-150 ${
                errors[field.id] ? "border-red-300" : "border-gray-100"
              }`}
            >
              <div className="p-5 md:p-6">
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isFirstPage && (
              <Button
                title="Back"
                onClick={handleBack}
                bgColor="bg-white hover:bg-gray-50"
                textColor="text-gray-700"
                className="border-2 border-gray-200 px-6 py-3 text-base md:text-lg shadow-md justify-center"
              />
            )}
            {isLastPage ? (
              <Button
                title={
                  uploadingFields.size > 0 ? "Uploading..." : "Submit Form"
                }
                onClick={handleSubmit}
                disabled={uploadingFields.size > 0}
                bgColor={`${uploadingFields.size > 0 ? "bg-gray-400" : "bg-gray-900 hover:bg-black"} justify-center px-6 py-3 text-base md:text-lg shadow-lg shadow-gray-200`}
              />
            ) : (
              <Button
                title="Next"
                onClick={handleNext}
                disabled={uploadingFields.size > 0}
                bgColor="bg-gray-900 hover:bg-black justify-center px-8 py-3 text-base md:text-lg shadow-lg"
              />
            )}
            <Button
              title="Clear"
              onClick={handleClearPage}
              disabled={uploadingFields.size > 0}
              bgColor="bg-white hover:bg-gray-50"
              textColor="text-gray-700"
              className="border-2 border-gray-200 px-6 py-3 text-base md:text-lg shadow-md justify-center"
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Never share passwords or sensitive info.
          </span>
        </div>
        {submitError && (
          <p className="mt-3 text-red-500 text-sm">{submitError}</p>
        )}
      </div>
    </div>
  );
}

export default SinglePage;
