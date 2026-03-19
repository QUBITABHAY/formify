import { useState, useEffect, useCallback } from "react";
import InputField from "../components/common/InputField";
import Checkbox from "../components/common/Checkbox";
import RadioButton from "../components/common/RadioButton";
import Button from "../components/common/Button";
import DatePicker from "../components/common/DatePicker";
import FileUpload from "../components/common/FileUpload";
import Select from "../components/common/Select";
import TextArea from "../components/common/TextArea";
import type {
  FormFieldConfig as FormField,
  ThankYouScreenConfig
} from "../components/BuilderCore/shared/types";
import { uploadFile } from "../services/api";
import { validateField } from "../utils/validation";

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
}: SinglePageProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(
    new Set(),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue || "";
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

  const validateAllFields = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, formData]);

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
        const errorData = err as { response?: { data?: { error?: string; message?: string } } };
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

  const handleReset = useCallback(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue || "";
    });
    setFormData(initialData);
    setErrors({});
    setSubmitError(null);
  }, [fields]);

  const handleSubmit = useCallback(async () => {
    if (uploadingFields.size > 0) return;
    if (validateAllFields()) {
      try {
        await onSubmit?.(formData);
        setIsSubmitted(true);
      } catch {
        setSubmitError("Form submission failed. Please try again.");
      }
    }
  }, [uploadingFields.size, validateAllFields, onSubmit, formData]);

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
      default:
        return null;
    }
  };

  if (isSubmitted) {
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

        <div className="mt-6 space-y-4">
          {fields.map((field) => (
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

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              title={uploadingFields.size > 0 ? "Uploading..." : "Submit Form"}
              onClick={handleSubmit}
              disabled={uploadingFields.size > 0}
              bgColor={`${uploadingFields.size > 0 ? "bg-gray-400" : "bg-gray-900 hover:bg-black"} justify-center px-6 py-3 text-base md:text-lg shadow-lg shadow-gray-200`}
            />
            <Button
              title="Clear Form"
              onClick={handleReset}
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
