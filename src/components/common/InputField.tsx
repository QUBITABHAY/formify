import { forwardRef } from "react";

interface InputFieldProps {
  title: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      title,
      type = "text",
      placeholder,
      maxLength,
      name,
      value,
      onChange,
      autoFocus,
      disabled,
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm font-normal text-gray-700 mb-2">
          {title}
        </label>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="p-3 border-b border-gray-300 focus:outline-none focus:border-gray-900 bg-transparent"
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          disabled={disabled}
        />
      </div>
    );
  },
);

export default InputField;
