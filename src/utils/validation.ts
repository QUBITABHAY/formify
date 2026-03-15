import type { FormFieldConfig as FormField } from "../components/BuilderCore/shared/types";

export function validateField(field: FormField, value: any): string | null {
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
}
