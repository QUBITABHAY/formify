# AGENTS.md — Formify Frontend Developer & AI Agent Guide

This document is the authoritative guide for AI coding assistants and autonomous agents working on the **Formify Frontend** codebase (`formify/`).

---

## 1. Role & Mission

You are an expert Frontend Engineer and React 19 specialist working on `formify`. Your goals:
1. Build and maintain intuitive, responsive, and robust UI components for form creation, customization, and submission.
2. Maintain feature parity and consistent behavior across both **Single Page** and **Flow** form modes.
3. Preserve strict TypeScript safety and ensure seamless schema alignment with the backend API.
4. Keep the codebase clean, adhering to React 19 standards and TailwindCSS v4 best practices.

---

## 2. Technology Stack & Dependencies

| Category | Technology | Version / Details |
| :--- | :--- | :--- |
| **Framework** | React 19 | `react@^19.2.3`, `react-dom@^19.2.3` with `babel-plugin-react-compiler` |
| **Build Tool** | Vite 7 | `vite@^7.2.4`, `@vitejs/plugin-react@^5.1.1` |
| **Language** | TypeScript | `typescript@~5.9.3` with strict typing |
| **Styling** | TailwindCSS v4 | `@tailwindcss/vite@^4.1.18` |
| **Routing** | React Router DOM v7 | `react-router-dom@^7.13.0` with lazy-loaded route components |
| **State** | Redux Toolkit | `@reduxjs/toolkit@^2.11.2`, `react-redux@^9.2.0` |
| **Drag & Drop** | `@dnd-kit` | `@dnd-kit/core@^6.3.1`, `@dnd-kit/sortable@^10.0.0` |
| **HTTP** | Axios | `axios@^1.13.4` (configured with `withCredentials: true`) |
| **Utilities** | PapaParse, Mapbox | CSV parsing and export, Mapbox location autocomplete |

---

## 3. Project Structure & Key Directories

```text
src/
├── components/
│   ├── BuilderCore/              # The form builder engine
│   │   ├── Flow/                 # Flow (Typeform-style) canvas & card components
│   │   │   ├── FlowCard.tsx      # Draggable card representing a step in Flow mode
│   │   │   ├── FlowFormBuilder.tsx # Flow builder controller
│   │   │   └── FlowPageCanvas.tsx # Canvas rendering Welcome, Step Cards, and Thank You
│   │   ├── Single/               # Single-page canvas & draggable field components
│   │   │   ├── DraggableField.tsx # Sortable field row on Single page canvas
│   │   │   ├── SinglePageCanvas.tsx # Canvas rendering Header and sortable fields
│   │   │   └── SinglePageFormBuilder.tsx # Single page builder controller
│   │   └── shared/               # Shared builder logic and UI
│   │       ├── EditorSections/   # Sub-panels in the right-hand property editor drawer:
│   │       │   ├── BasicFieldSettings.tsx  # Title, subtitle, placeholder, limits
│   │       │   ├── HeaderSettings.tsx      # Form title, description, banner image
│   │       │   ├── LogicEditor.tsx         # Conditional rule definition
│   │       │   ├── OptionsEditor.tsx       # Option list management (radio/select/checkbox)
│   │       │   ├── QuizAnswerSettings.tsx  # Correct answers and points assignment
│   │       │   └── ScreenEditor.tsx        # Welcome & Thank You screen customization
│   │       ├── constants.tsx     # Palette item definitions (`FIELD_PALETTE_ITEMS`)
│   │       ├── FieldEditor.tsx   # Master property editor panel
│   │       ├── FieldPalette.tsx  # Drag-and-drop field types palette
│   │       ├── FormBuilder.tsx   # Container switching between Single and Flow builders
│   │       ├── PreviewModal.tsx  # Live preview dialog for both layouts
│   │       ├── quizUtils.ts      # Score calculation and answer evaluation
│   │       ├── types.ts          # Core TypeScript models (FormFieldConfig, Logic, Quiz)
│   │       └── useFormBuilder.ts # Core hook managing builder state, history, and actions
│   └── common/                   # Reusable atomic UI components
│       ├── Button.tsx            # Button with variant and size styling
│       ├── Checkbox.tsx          # Form checkbox input
│       ├── DatePicker.tsx        # Custom calendar picker
│       ├── FileUpload.tsx        # File drag-and-drop with Cloudinary upload
│       ├── Footer.tsx            # Global footer component
│       ├── FormattedAnswer.tsx   # Formatted response value renderer
│       ├── GoogleSheetsModal.tsx # Google Sheets link and auto-sync modal
│       ├── icons.tsx             # Shared SVG icons dictionary (`Icons.*`)
│       ├── InputField.tsx        # Text/email/number input (`forwardRef`)
│       ├── Modal.tsx             # Standard dialog modal wrapper
│       ├── RadioButton.tsx       # Radio option button
│       ├── Rating.tsx            # Star/heart/smile/thumb rating control
│       ├── Select.tsx            # Dropdown selector (`forwardRef`)
│       ├── ShareModal.tsx        # Share link popup with QR & copy actions
│       ├── TextArea.tsx          # Multi-line text input (`forwardRef`)
│       └── TimePicker.tsx        # Custom time selector component
├── layouts/
│   ├── FlowPage.tsx              # Typeform-like sequential step renderer
│   └── SinglePage.tsx            # Traditional vertical form renderer with Quiz mode
├── pages/                        # Application views
│   ├── AuthCallbackPage.tsx      # OAuth redirect receiver
│   ├── BuilderPage.tsx           # Form builder page (`/builder/:formId`)
│   ├── DashboardPage.tsx         # User forms dashboard (`/dashboard`)
│   ├── FormResponsesPage.tsx     # Responses table & CSV export (`/forms/:formId/responses`)
│   ├── HomePage.tsx              # Public home page (`/`)
│   ├── PrivacyPage.tsx           # Privacy policy page (`/privacy`)
│   ├── PublicFormPage.tsx        # Responder form view (`/forms/:formId`)
│   ├── ResponsePage.tsx          # Single submission detail page (`/responses/:responseId`)
│   └── TermsPage.tsx             # Terms of service page (`/terms`)
├── services/
│   ├── api.ts                    # Backend Axios client & API methods
│   └── apiTypes.ts               # Request and response TypeScript interfaces
├── store/
│   ├── slices/authSlice.ts       # Authentication state slice
│   └── store.ts                  # Redux root store
└── utils/
    ├── formatters.ts             # Date and time formatting utilities
    └── validation.ts             # Input validation functions
```

---

## 4. Domain Concepts & Implementation Details

### 4.1 Field Types (`FieldType`)
- Standard text: `"text"`, `"textarea"`, `"email"`, `"tel"`, `"number"`
- Option selectors: `"radio"`, `"checkbox"`, `"select"`
- Date & Time: `"date"`, `"time"`
- Media & Rating: `"file"`, `"rating"`
- Layout helpers: `"page_break"`

### 4.2 Form Builder State (`useFormBuilder`)
The form builder is driven by `useFormBuilder.ts` which manages:
- `fields`: Array of `FormFieldConfig` objects.
- `mode`: `"single" | "flow"`.
- `selectedFieldId`: Currently selected field for editing in `FieldEditor`.
- `welcomeScreen` & `thankYouScreen`: Flow mode configurations.
- `header`: Single page header configuration (`title`, `description`, `banner`).
- `isQuiz`: Boolean flag enabling Quiz Mode.

### 4.3 Conditional Branching (Flow Mode)
- Defined per-field in `field.logic.rules`.
- Operators supported: `"equals"`, `"not_equals"`, `"contains"`, `"not_contains"`.
- Target: `targetFieldId` can be a specific field ID or `"SUBMIT"`.
- Evaluated in `FlowPage.tsx` sequentially upon answering each question.

### 4.4 Quiz Mode (Single Page Mode)
- Configured via `correctAnswer` and `points` per field.
- Answers are evaluated by `isAnswerCorrect` in `src/components/BuilderCore/shared/quizUtils.ts`.
- Scores and question breakdowns are computed and displayed to responders upon submission.

---

## 5. Coding Standards & Agent Guardrails

1. **Idiomatic React 19**: Do not add unnecessary `useCallback` or `useMemo` hooks unless stabilizing references for external dependencies.
2. **Forward Refs**: All new input primitives placed in `src/components/common/` must wrap elements with `forwardRef` and specify `displayName`.
3. **Atomic Components**: Reuse existing primitives in `src/components/common/` to maintain visual consistency.
4. **TailwindCSS v4**: Write clean utility classes. Ensure full responsive design (`sm:`, `md:`, `lg:`).
5. **API & Types Synchronization**: Whenever modifying backend interactions, keep `src/services/api.ts` and `src/services/apiTypes.ts` fully typed and synchronized.
6. **Error Handling**: Handle network and validation errors gracefully with appropriate UI feedback (modals or notification alerts).

---

## 6. Verification Checklist

Before completing any task, always execute:
1. **Linting Check**:
   ```bash
   npm run lint
   ```
   Must complete with zero ESLint errors or warnings.
2. **Typecheck & Production Build**:
   ```bash
   npm run build
   ```
   Must succeed without TypeScript compilation (`tsc -b`) errors.
