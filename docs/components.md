# Components

## InputFeild

- title: string
- type?: string
- placeholder?: string
- maxLength?: number
- default values
    - type: text

## Button

- title: string
- onClick: function
- bgColor?: string
- textColor?: string
- default values
    - bgColor: bg-blue-500
    - textColor: text-white

## Checkbox

- title: string
- checked: boolean
- default values
    - checked: false

## RadioButton

- title: string
- name: string
- value: string
- checked?: boolean
- onChange?: (value: string) => void