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
  | "select"
  | "date"
  | "file";

export interface FieldOption {
  label: string;
  value: string;
}

export interface ConditionalRule {
  id: string;
  operator: "equals" | "not_equals" | "contains" | "not_contains";
  value: string;
  targetFieldId: string;
}

export interface FieldLogic {
  rules: ConditionalRule[];
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
  minDate?: string;
  maxDate?: string;
  logic?: FieldLogic;
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
