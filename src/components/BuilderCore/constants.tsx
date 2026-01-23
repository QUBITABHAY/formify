import type { FieldTemplate } from "./types";
import { Icons } from "../common/icons";

export const FIELD_TEMPLATES: FieldTemplate[] = [
  {
    type: "text",
    label: "Text Input",
    icon: <Icons.Text />,
    defaultConfig: {
      title: "Text Field",
      placeholder: "Enter text...",
    },
  },
  {
    type: "email",
    label: "Email",
    icon: <Icons.Email />,
    defaultConfig: {
      title: "Email Address",
      placeholder: "Enter email...",
    },
  },
  {
    type: "tel",
    label: "Phone",
    icon: <Icons.Phone />,
    defaultConfig: {
      title: "Phone Number",
      placeholder: "Enter phone number...",
      maxLength: 15,
    },
  },
  {
    type: "number",
    label: "Number",
    icon: <Icons.Number />,
    defaultConfig: {
      title: "Number Field",
      placeholder: "Enter number...",
    },
  },
  {
    type: "textarea",
    label: "Long Text",
    icon: <Icons.TextArea />,
    defaultConfig: {
      title: "Long Text",
      placeholder: "Enter your response...",
    },
  },
  {
    type: "radio",
    label: "Multiple Choice",
    icon: <Icons.Radio />,
    defaultConfig: {
      title: "Select an option",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
    },
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <Icons.Checkbox />,
    defaultConfig: {
      title: "Checkbox Field",
      defaultValue: false,
    },
  },
  {
    type: "select",
    label: "Dropdown",
    icon: <Icons.Select />,
    defaultConfig: {
      title: "Select an option",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
    },
  },
];
