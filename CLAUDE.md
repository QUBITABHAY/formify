# CLAUDE.md — Formify Frontend

This document provides architecture context, development guidelines, schema definitions, and command references for Claude Code when working in the `formify` frontend repository.

---

## 1. Project Overview

**Formify Frontend** is a modern form builder and submission platform built with React 19, TypeScript, and TailwindCSS v4. It allows users to design, publish, and analyze customizable forms in two distinct rendering layouts:
- **Single Page Mode**: Traditional vertical layout displaying all form questions, banner images, header titles, and automated **Quiz Mode** scoring.
- **Flow Mode**: Step-by-step Typeform-style questionnaire with custom Welcome Screen, Thank You Screen, and dynamic **Conditional Logic** jumping.
- **Integrations & Analytics**: Response capture, CSV export via PapaParse, Google Sheets automatic synchronization, and Cloudinary media uploads.

---

## 2. Tech Stack

- **Framework**: [React 19](https://react.dev/) (`react@^19.2.3`, `react-dom@^19.2.3`)
- **React Compiler**: `babel-plugin-react-compiler` enabled in Vite React plugin
- **Build Tool**: [Vite 7](https://vitejs.dev/) (`vite@^7.2.4`, `@vitejs/plugin-react@^5.1.1`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (~5.9.3) configured with strict mode (`tsconfig.app.json`)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) (`@tailwindcss/vite@^4.1.18`)
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (`react-router-dom@^7.13.0`)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit@^2.11.2`, `react-redux@^9.2.0`)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/) (`^6.3.1`), `@dnd-kit/sortable` (`^10.0.0`), `@dnd-kit/utilities` (`^3.2.2`)
- **HTTP Client**: [Axios](https://axios-http.com/) (`^1.13.4`)
- **Export & Maps**: `papaparse` (`^5.5.3`), `mapbox-gl` (`^3.18.1`), `react-map-gl` (`^8.1.0`), `@mapbox/search-js-react` (`^1.5.1`)
- **Code Quality**: ESLint 9 (`eslint@^9.39.1`), `typescript-eslint`, Prettier, Pre-commit

---

## 3. Development Commands

Run these commands from `formify/`:

```bash
# Install dependencies
npm install

# Start development server on http://localhost:5173
npm run dev

# Run TypeScript compilation check & build production bundle to dist/
npm run build

# Run ESLint across all files
npm run lint

# Preview the production build locally
npm run preview

# Run pre-commit checks on all files (if pre-commit is installed)
pre-commit run --all-files
```

---

## 4. Architecture & Directory Map

```text
formify/
├── docs/                                  # Project documentation
│   ├── components.md                      # UI and builder component reference
│   └── forms.md                           # Layouts, logic, and quiz mode specifications
├── public/                                # Static public assets
├── src/
│   ├── assets/                            # Images and graphics
│   ├── components/
│   │   ├── BuilderCore/                   # Form builder core modules
│   │   │   ├── Flow/                      # Flow builder canvas and card components
│   │   │   │   ├── FlowCard.tsx           # Sortable step card in Flow canvas
│   │   │   │   ├── FlowFormBuilder.tsx    # Flow mode master builder
│   │   │   │   └── FlowPageCanvas.tsx     # Flow canvas with Welcome, Cards, Thank You
│   │   │   ├── Single/                    # Single-page builder canvas and field components
│   │   │   │   ├── DraggableField.tsx     # Draggable field item in Single canvas
│   │   │   │   ├── SinglePageCanvas.tsx   # Single page canvas with header and fields
│   │   │   │   └── SinglePageFormBuilder.tsx # Single page master builder
│   │   │   └── shared/                    # Shared builder components & utilities
│   │   │       ├── EditorSections/        # Sub-panels inside FieldEditor
│   │   │       │   ├── BasicFieldSettings.tsx  # Title, subtitle, placeholder, limits
│   │   │       │   ├── HeaderSettings.tsx      # Form title, description, banner URL
│   │   │       │   ├── LogicEditor.tsx         # Conditional branching rule editor
│   │   │       │   ├── OptionsEditor.tsx       # Radio/Select/Checkbox option items
│   │   │       │   ├── QuizAnswerSettings.tsx  # Correct answer & points editor
│   │   │       │   └── ScreenEditor.tsx        # Welcome & Thank You screen editor
│   │   │       ├── constants.tsx          # FIELD_PALETTE_ITEMS definitions
│   │   │       ├── FieldEditor.tsx        # Property editor drawer for fields & screens
│   │   │       ├── FieldPalette.tsx       # Draggable field palette sidebar
│   │   │       ├── FormBuilder.tsx        # Top-level builder container with mode toggle
│   │   │       ├── PreviewModal.tsx       # Live form preview dialog
│   │   │       ├── quizUtils.ts           # Quiz scoring and answer checking helpers
│   │   │       ├── types.ts               # Core builder TypeScript interfaces
│   │   │       └── useFormBuilder.ts      # Custom state hook for builder operations
│   │   └── common/                        # Reusable atomic UI components
│   │       ├── Button.tsx                 # Button component with customizable colors
│   │       ├── Checkbox.tsx               # Checkbox input with label
│   │       ├── DatePicker.tsx             # Custom calendar dropdown picker
│   │       ├── FileUpload.tsx             # Drag-and-drop file uploader (Cloudinary)
│   │       ├── Footer.tsx                 # App footer with copyright and legal links
│   │       ├── FormattedAnswer.tsx        # Helper rendering formatted response answers
│   │       ├── GoogleSheetsModal.tsx      # Modal to link/unlink Google Sheets & auto-sync
│   │       ├── icons.tsx                  # Shared SVG icon library (Icons.*)
│   │       ├── InputField.tsx             # Text/Number/Email/Phone input (forwardRef)
│   │       ├── Modal.tsx                  # Reusable dialog modal wrapper
│   │       ├── RadioButton.tsx            # Radio button option
│   │       ├── Rating.tsx                 # Star/Heart/Smile/Thumb rating component
│   │       ├── Select.tsx                 # Styled dropdown component (forwardRef)
│   │       ├── ShareModal.tsx             # Share link dialog with copy-to-clipboard
│   │       ├── TextArea.tsx               # Multiline textarea component (forwardRef)
│   │       └── TimePicker.tsx             # Custom time picker component
│   ├── layouts/                           # Form execution engines
│   │   ├── FlowPage.tsx                   # Typeform-style step-by-step questionnaire
│   │   └── SinglePage.tsx                 # Traditional single-page form with Quiz scoring
│   ├── pages/                             # Route page components
│   │   ├── AuthCallbackPage.tsx           # Handles OAuth redirect callback
│   │   ├── BuilderPage.tsx                # Form builder wrapper page (/builder/:formId)
│   │   ├── DashboardPage.tsx              # User dashboard (/dashboard)
│   │   ├── FormResponsesPage.tsx          # Form submissions table & CSV export (/forms/:formId/responses)
│   │   ├── HomePage.tsx                   # Landing page (/)
│   │   ├── PrivacyPage.tsx                # Privacy policy (/privacy)
│   │   ├── PublicFormPage.tsx             # Public responder form view (/forms/:formId)
│   │   ├── ResponsePage.tsx               # Single response inspector (/responses/:responseId)
│   │   └── TermsPage.tsx                  # Terms of service (/terms)
│   ├── services/                          # Network services
│   │   ├── api.ts                         # Axios API instance and endpoints
│   │   └── apiTypes.ts                    # Backend request & response TypeScript types
│   ├── store/                             # Global state management
│   │   ├── slices/
│   │   │   └── authSlice.ts               # Authentication state slice
│   │   └── store.ts                       # Redux Toolkit store setup
│   ├── utils/                             # Utility helpers
│   │   ├── formatters.ts                  # Date & time locale formatting helpers
│   │   └── validation.ts                  # Form input validation logic
│   ├── App.css                            # Global application CSS
│   ├── App.tsx                            # Route configuration with React.lazy
│   ├── index.css                          # Tailwind CSS imports & global styles
│   └── main.tsx                           # App entrypoint (Redux Provider & root mount)
├── eslint.config.js                       # ESLint 9 flat configuration
├── package.json                           # NPM dependencies & scripts
├── tsconfig.app.json                      # Application TypeScript compiler options
├── tsconfig.json                          # Solution TypeScript configuration
└── vite.config.ts                         # Vite configuration with Tailwind & React Compiler
```

---

## 5. Domain Models & Schemas

### 5.1 Field Types (`FieldType`)
All supported field types in `src/components/BuilderCore/shared/types.ts`:
- `"text"` — Single-line text input
- `"number"` — Numeric input
- `"email"` — Email address with validation
- `"tel"` — Telephone number input
- `"radio"` — Single-choice radio group
- `"checkbox"` — Checkbox toggle or multi-select option
- `"textarea"` — Multiline text area
- `"select"` — Dropdown selector
- `"date"` — Date picker calendar
- `"time"` — Time selector
- `"file"` — File upload input (Cloudinary integration)
- `"rating"` — Interactive rating (star, heart, smile, thumb)
- `"page_break"` — Visual section separator

### 5.2 Form Field Configuration (`FormFieldConfig`)
```typescript
export interface FormFieldConfig {
  id: string;
  type: FieldType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  maxLength?: number;
  options?: { label: string; value: string }[];
  defaultValue?: string | boolean | number | string[];
  name?: string;
  required?: boolean;
  multiSelect?: boolean;
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
  maxRating?: number;
  ratingSymbol?: "star" | "heart" | "smile" | "thumb";
  logic?: {
    rules: {
      id: string;
      operator: "equals" | "not_equals" | "contains" | "not_contains";
      value: string;
      targetFieldId: string; // Target field ID or "SUBMIT"
    }[];
  };
  correctAnswer?: string | string[];
  points?: number;
}
```

### 5.3 Screen Configurations
- **WelcomeScreenConfig**: `{ title: string; description: string; buttonText: string }`
- **ThankYouScreenConfig**: `{ title: string; description: string; emoji: string }`

---

## 6. API Client Integration (`src/services/api.ts`)

The Axios client communicates with the backend with `withCredentials: true` enabled for cookie session authentication.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `createForm(data)` | `POST /api/forms` | Create a new draft form |
| `getForms(userId)` | `GET /api/users/:userId/forms` | Fetch all forms owned by user |
| `getForm(id)` | `GET /api/forms/:id` | Fetch specific form details |
| `getPublicForm(shareUrl)` | `GET /api/forms/share/:shareUrl` | Fetch published form for responder |
| `updateForm(id, data)` | `PUT /api/forms/:id` | Update schema, settings, name, or description |
| `deleteForm(id)` | `DELETE /api/forms/:id` | Delete form |
| `publishForm(id)` | `POST /api/forms/:id/publish` | Publish form and generate share URL |
| `unpublishForm(id)` | `POST /api/forms/:id/unpublish` | Unpublish form |
| `submitResponse(formId, data, meta)` | `POST /api/forms/:formId/responses` | Submit answers to a published form |
| `uploadFile(formId, file)` | `POST /api/forms/:formId/upload` | Upload file (multipart) to Cloudinary |
| `getFormResponses(formId)` | `GET /api/forms/:formId/responses` | List all responses for a form |
| `getResponse(id)` | `GET /api/responses/:id` | Get single response details |
| `deleteResponse(id)` | `DELETE /api/responses/:id` | Delete single response |
| `createAndLinkGoogleSheet(formId, data)` | `POST /api/forms/:formId/sheets/create` | Create & link Google Spreadsheet |
| `unlinkGoogleSheet(formId)` | `DELETE /api/forms/:formId/sheets/link` | Unlink connected Google Sheet |
| `getCurrentUser()` | `GET /api/auth/me` | Fetch authenticated user profile |
| `getGoogleAuthUrl()` | `GET /api/auth/google` | OAuth redirect URL helper |

---

## 7. Key Frontend Guidelines & Conventions

1. **React 19 & Compiler Optimization**: Write idiomatic React code. Avoid unnecessary manual memoization (`useMemo`, `useCallback`) unless required for third-party library stability.
2. **Forward Refs**: Form input components in `src/components/common/` (`InputField`, `TextArea`, `Select`) must use `forwardRef` to support keyboard focus and scrolling.
3. **Reusable Primitives**: Always reuse components in `src/components/common/` rather than re-creating ad-hoc form inputs.
4. **TailwindCSS v4 Utility Usage**: Use standard Tailwind utilities. Maintain responsive design for mobile and desktop screens.
5. **State Management**:
   - Form builder local state is managed through `useFormBuilder.ts`.
   - Global user session state is stored in Redux (`authSlice.ts`).
6. **Environment Variables**:
   - `VITE_API_URL`: Backend server base URL (e.g. `http://localhost:1323`).
