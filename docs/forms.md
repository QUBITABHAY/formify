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
  name?: string;
  required?: boolean;
}
```

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
