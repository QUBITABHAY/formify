# Components

## InputFeild

- title: string (required)
- type?: string — default: text
- placeholder?: string
- maxLength?: number
- name?: string
- value?: string | number
- onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
- autoFocus?: boolean
- ref?: React.Ref<HTMLInputElement> — supports forwardRef for programmatic focus

## Button

- title: string (required)
- onClick: () => void (required)
- bgColor?: string — default: bg-blue-500
- textColor?: string — default: text-white

## Checkbox

- title: string (required)
- checked?: boolean — default: false
- name?: string
- onChange?: (checked: boolean) => void

## RadioButton

- title: string (required)
- name: string (required)
- value: string (required)
- checked?: boolean
- onChange?: (value: string) => void
