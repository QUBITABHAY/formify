import { forwardRef } from "react";

interface InputFeildProps {
  title: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

const InputFeild = forwardRef<HTMLInputElement, InputFeildProps>(
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
          className="p-3 border-b border-gray-300 focus:outline-none focus:border-blue-600 bg-transparent"
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
      </div>
    );
  },
);

export default InputFeild;
