import { useState, useEffect } from "react";
import InputField from "../components/common/InputField";
import Checkbox from "../components/common/Checkbox";
import RadioButton from "../components/common/RadioButton";
import Button from "../components/common/Button";
import type { FormFieldConfig as FormField } from "../components/BuilderCore/shared/types";

interface SinglePageProps {
  formTitle?: string;
  formDescription?: string;
  formBanner?: string;
  fields?: FormField[];
  onSubmit?: (data: Record<string, any>) => void;
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
  onSubmit,
}: SinglePageProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue || "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
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

  const validateAllFields = (): boolean => {
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
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      setIsSubmitted(true);
      onSubmit?.(formData);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <InputField
            title={field.title}
            type={field.type}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={formData[field.id] || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "radio":
        if (field.multiSelect) {
          const selectedValues = Array.isArray(formData[field.id])
            ? formData[field.id]
            : [];
          return (
            <div>
              <label className="text-sm font-normal text-gray-700 mb-3 block">
                {field.title}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex flex-col gap-3">
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
            </div>
          );
        }
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-3 block">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
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
            checked={formData[field.id] || false}
            onChange={(checked) => handleFieldChange(field.id, checked)}
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
            <div className="h-2 bg-blue-600"></div>
            <div className="p-8 text-center">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                Your response has been recorded
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for submitting the form.
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
          <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100">
            <img
              src={formBanner}
              alt="Form Banner"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              {formTitle}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
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

        <div className="mt-8 flex items-center gap-4">
          <Button
            title="Submit Form"
            onClick={handleSubmit}
            bgColor="bg-blue-600 hover:bg-blue-700 justify-center px-6 py-3 text-base md:text-lg shadow-lg shadow-blue-200"
          />
          <span className="text-sm text-gray-500">
            Never share passwords or sensitive info.
          </span>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
