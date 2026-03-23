import { forwardRef } from "react";

interface TextAreaProps {
  title: string;
  placeholder?: string;
  name?: string;
  value?: string;
  rows?: number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  subtitle?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      title,
      placeholder,
      name,
      value,
      rows = 4,
      maxLength,
      onChange,
      subtitle,
      disabled,
      autoFocus,
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm font-normal text-gray-700 mb-2">
          {title}
        </label>
        {subtitle && <p className="text-base text-gray-500 mb-2">{subtitle}</p>}
        <textarea
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          autoFocus={autoFocus}
          className="p-3 border-b border-gray-300 focus:outline-none focus:border-gray-900 bg-transparent resize-none"
          placeholder={placeholder}
        />
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
