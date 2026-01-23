import { ReactNode } from "react";

export type FieldType = "text" | "number" | "email" | "tel" | "radio" | "checkbox" | "textarea" | "select";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  id: string;
  type: FieldType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  maxLength?: number;
  options?: FieldOption[];
  defaultValue?: string | boolean;
  name?: string;
  required?: boolean;
}

export interface FieldTemplate {
  type: FieldType;
  label: string;
  icon: ReactNode;
  defaultConfig: Partial<FormFieldConfig>;
}
