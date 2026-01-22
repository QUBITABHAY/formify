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
