import { useState } from "react";
import InputFeild from "../components/common/InputFeild";
import Checkbox from "../components/common/Checkbox";
import RadioButton from "../components/common/RadioButton";
import Button from "../components/common/Button";

type FieldType = "text" | "number" | "email" | "tel" | "radio" | "checkbox";

interface FieldOption {
  label: string;
  value: string;
}

interface FormField {
  id: string;
  type: FieldType;
  title: string;
  placeholder?: string;
  maxLength?: number;
  options?: FieldOption[];
  defaultValue?: string | boolean;
  name?: string;
  formBanner?: string;
  formTitle?: string;
  formDescription?: string;
}

function SinglePage() {
  const formTitle = "Registration Form";
  const formDescription = "Please fill out the details below.";
  const formBanner = "https://picsum.photos/800/200";

  const initialFields: FormField[] = [
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

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    initialFields.forEach((field) => {
      initialData[field.id] = field.defaultValue;
    });
    return initialData;
  });

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Submitted with Data:", formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <InputFeild
            title={field.title}
            type={field.type}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={formData[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "radio":
        return (
          <div>
            <label className="text-sm font-normal text-gray-700 mb-3 block">
              {field.title}
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
            checked={formData[field.id]}
            onChange={(checked) => handleFieldChange(field.id, checked)}
          />
        );
      default:
        return null;
    }
  };

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
          {initialFields.map((field) => (
            <div
              key={field.id}
              className="bg-white rounded-lg border border-gray-100 shadow-md transition-shadow duration-150"
            >
              <div className="p-5 md:p-6">{renderField(field)}</div>
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
