interface InputFeildProps {
  title: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputFeild({ title, type = 'text', placeholder, maxLength, name, value, onChange }: InputFeildProps) {
  return (
    <div className="flex flex-col">
      <label
        className="text-sm font-medium text-gray-900"
      >
        {title}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}

export default InputFeild;
