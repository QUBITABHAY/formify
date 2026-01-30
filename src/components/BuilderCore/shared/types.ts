import type { ReactNode } from "react";

export type FormMode = "single" | "flow";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "radio"
  | "checkbox"
  | "textarea"
  | "select";

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
  defaultValue?: string | boolean | string[];
  name?: string;
  required?: boolean;
  multiSelect?: boolean;
}

export interface FieldTemplate {
  type: FieldType;
  label: string;
  icon: ReactNode;
  defaultConfig: Partial<FormFieldConfig>;
}

export interface WelcomeScreenConfig {
  title: string;
  description: string;
  buttonText: string;
}

export interface ThankYouScreenConfig {
  title: string;
  description: string;
  emoji: string;
}
