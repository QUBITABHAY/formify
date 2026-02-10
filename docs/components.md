# Components

Documentation for reusable UI components found in `src/components/common`.

## Button

A standard button component with customizable colors.

- `title`: string (required) — Button text
- `onClick`: () => void (required) — Click handler
- `bgColor`: string (optional) — Tailwind class for background color (default: `'bg-blue-500'`)
- `textColor`: string (optional) — Tailwind class for text color (default: `'text-white'`)

## Checkbox

A checkbox field with a label.

- `title`: string (required) — Label text
- `checked`: boolean (optional) — Checked state (default: `false`)
- `name`: string (optional) — Input name attribute
- `onChange`: (checked: boolean) => void (optional) — Change handler returning new checked state
- `disabled`: boolean (optional) — Disables interaction

## InputField

A flexible input wrapper supporting forwardRef.

- `title`: string (required) — Label text
- `type`: string (optional) — Input type (default: `'text'`)
- `placeholder`: string (optional)
- `maxLength`: number (optional)
- `name`: string (optional)
- `value`: string | number (optional)
- `onChange`: (e: React.ChangeEvent<HTMLInputElement>) => void (optional)
- `autoFocus`: boolean (optional)
- `disabled`: boolean (optional)
- **Ref**: Supports `forwardRef`

## RadioButton

A single radio button with a label.

- `title`: string (required) — Label text
- `name`: string (required) — Input name (group identifier)
- `value`: string (required) — Input value
- `checked`: boolean (optional)
- `onChange`: (value: string) => void (optional)
- `disabled`: boolean (optional)

## Select

A styled dropdown select component supporting forwardRef.

- `title`: string (required) — Label text
- `options`: { label: string; value: string }[] (required) — Array of options
- `name`: string (optional)
- `value`: string (optional)
- `onChange`: (e: React.ChangeEvent<HTMLSelectElement>) => void (optional)
- `placeholder`: string (optional) — Default option text (default: `'Select an option'`)
- `disabled`: boolean (optional)
- **Ref**: Supports `forwardRef`

## TextArea

A textarea component support forwardRef.

- `title`: string (required) — Label text
- `placeholder`: string (optional)
- `name`: string (optional)
- `value`: string (optional)
- `rows`: number (optional) — Number of rows (default: `4`)
- `maxLength`: number (optional)
- `onChange`: (e: React.ChangeEvent<HTMLTextAreaElement>) => void (optional)
- `disabled`: boolean (optional)
- **Ref**: Supports `forwardRef`

## Icons

A collection of SVG icons exported as the `Icons` object.

- Usage: `import { Icons } from "../common/icons";`
- Available Icons:
  - `Icons.Text`
  - `Icons.Email`
  - `Icons.Phone`
  - `Icons.Number`
  - `Icons.TextArea`
  - `Icons.Radio`
  - `Icons.Checkbox`
  - `Icons.Select`
  - `Icons.Eye`
  - `Icons.ArrowLeft`
  - `Icons.Logic`

---

# BuilderCore

The form builder components are organized in `src/components/BuilderCore` with the following structure:

```
BuilderCore/
├── Flow/           # Flow (Typeform-style) builder components
├── Single/         # Single page builder components
└── shared/         # Shared components and utilities
```

## Shared Components (`shared/`)

### FormBuilder

Main entry point that provides a mode toggle between Flow and Single page builders.

- Location: `src/components/BuilderCore/shared/FormBuilder.tsx`
- Usage: `import FormBuilder from "./components/BuilderCore/shared/FormBuilder"`

### FieldEditor

Property editor panel for configuring field properties.

- Handles field editing for both modes
- Supports Welcome/ThankYou screen editing (Flow) and Header editing (Single)
- Includes **Conditional Logic** builder for Flow mode
- Props are mode-aware (`mode: "flow" | "single"`)

### FieldPalette

Draggable field type palette for adding new fields.

- Uses `@dnd-kit/core` for drag functionality
- Renders available field types from `constants.tsx`

### PreviewModal

Modal component for previewing forms using `FlowPage` or `SinglePage` layouts.

### Types (`types.ts`)

Core type definitions:

- `FormMode` — `"single" | "flow"`
- `FieldType` — `"text" | "number" | "email" | "tel" | "radio" | "checkbox" | "textarea" | "select"`
- `FormFieldConfig` — Field configuration interface (now includes optional `logic`)
- `ConditionalRule` — Logic rule definition (`operator`, `value`, `targetFieldId`)
- `FieldLogic` — Container for field rules
- `FieldTemplate` — Template for field palette items
- `WelcomeScreenConfig` / `ThankYouScreenConfig` — Flow screen configs

---

## Flow Components (`Flow/`)

### FlowFormBuilder

Main builder for Typeform-style forms with welcome/thankyou screens.

### FlowPageCanvas

Canvas displaying welcome screen, sortable field cards, and thankyou screen.

### FlowCard

Step card component with step number indicator and field preview.

---

## Single Components (`Single/`)

### SinglePageFormBuilder

Main builder for traditional single-page forms with header/banner.

### SinglePageCanvas

Canvas displaying form header and sortable field list.

### DraggableField

Draggable/sortable field component for single page forms.
