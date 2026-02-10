# Form Layouts

Formify provides two layout options for rendering forms.

---

## SinglePage

Traditional single-page form layout where all fields are displayed at once.

### Props

| Prop            | Type                                | Description                     |
| --------------- | ----------------------------------- | ------------------------------- |
| formTitle       | string                              | Form title displayed at the top |
| formDescription | string                              | Form description/subtitle       |
| formBanner      | string                              | URL for the banner image        |
| fields          | FormField[]                         | Array of form fields to render  |
| onSubmit        | (data: Record<string, any>) => void | Callback when form is submitted |

### Features

- All fields visible on one page
- Single submit button at the bottom
- Simple and straightforward

---

## FlowPage

Typeform-style layout with one question at a time and smooth transitions.

### Props

| Prop            | Type                                | Default                         | Description                      |
| --------------- | ----------------------------------- | ------------------------------- | -------------------------------- |
| formTitle       | string                              | "Welcome!"                      | Default title for welcome screen |
| formDescription | string                              | "Let's get to know you better." | Default description              |
| fields          | FormField[]                         | —                               | Array of form fields to render   |
| onSubmit        | (data: Record<string, any>) => void | —                               | Callback when form is submitted  |
| welcomeScreen   | WelcomeScreenProps                  | {}                              | Welcome screen customization     |
| thankYouScreen  | ThankYouScreenProps                 | {}                              | Thank you screen customization   |

### WelcomeScreenProps

| Prop        | Type   | Default         |
| ----------- | ------ | --------------- |
| title       | string | formTitle       |
| description | string | formDescription |
| buttonText  | string | "Start"         |

### ThankYouScreenProps

| Prop        | Type   | Default                               |
| ----------- | ------ | ------------------------------------- |
| title       | string | "Thank you!"                          |
| description | string | "Your response has been submitted..." |
| emoji       | string | "🎉"                                  |

### Features

- Smooth step-by-step transitions
- **Conditional Logic:** Branching paths based on user answers
- Built-in validation and required field checks
- Custom welcome and thank you screens

---

## FormField Interface

Both layouts use the same field structure:

```typescript
interface FormField {
  id: string;
  type: "text" | "number" | "email" | "tel" | "radio" | "checkbox";
  title: string;
  subtitle?: string;
  placeholder?: string;
  maxLength?: number;
  options?: { label: string; value: string }[];
  defaultValue?: string | boolean;
  /* Flow-only: Conditional branching */
  logic?: {
    rules: {
      id: string;
      operator: "equals" | "not_equals" | "contains" | "not_contains";
      value: string;
      targetFieldId: string; // ID of field to jump to, or "SUBMIT"
    }[];
  };
  name?: string;
  required?: boolean;
}
```

---

## Conditional Logic (Flow Only)

Flow forms support conditional branching, allowing users to skip questions or take different paths based on their answers.

### Structure

Logic is defined in the `logic` property of a `FormField`. It consists of a list of rules that are evaluated in order.

- **Rule Evaluation:** The first rule that matches the user's input determines the next step.
- **Default Path:** If no rules match, the form proceeds to the next sequential field.
- **Target:** A rule can jump to a specific `targetFieldId` or trigger an early submission (`targetFieldId: "SUBMIT"`).
- **Checkbox Logic:** For checkbox fields, use "Checked" (true) or "Unchecked" (false) as the value.

### Operators

- `equals`: Exact match (case-sensitive)
- `not_equals`: Does not match
- `contains`: Value contains string (case-insensitive)
- `not_contains`: Value does not contain string

---

## Usage Examples

### SinglePage

```tsx
import SinglePage from "./layouts/SinglePage";

<SinglePage
  formTitle="Contact Us"
  formDescription="Fill out the form below"
  formBanner="https://example.com/banner.jpg"
  fields={fields}
  onSubmit={(data) => console.log(data)}
/>;
```

### FlowPage

```tsx
import FlowPage from "./layouts/FlowPage";

<FlowPage
  formTitle="Quick Survey"
  formDescription="We would love to hear your thoughts."
  fields={fields}
  onSubmit={(data) => console.log(data)}
  welcomeScreen={{
    title: "Quick Survey",
    description: "Takes only 2 minutes",
    buttonText: "Begin",
  }}
  thankYouScreen={{
    title: "All Done!",
    description: "Thanks for your feedback",
    emoji: "✨",
  }}
/>;
```

---

## BuilderCore Integration

The form builder components in `src/components/BuilderCore/` use these layouts for previewing forms:

- **PreviewModal** (`shared/PreviewModal.tsx`) renders `FlowPage` or `SinglePage` based on the selected mode
- **FlowFormBuilder** (`Flow/FlowFormBuilder.tsx`) builds forms for the Flow layout
- **SinglePageFormBuilder** (`Single/SinglePageFormBuilder.tsx`) builds forms for the Single layout

See [components.md](./components.md#buildercore) for full BuilderCore documentation.
