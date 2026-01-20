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
    <div className="flex flex-col w-full">
      <label
        className="text-sm font-normal text-gray-700 mb-2"
      >
        {title}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="p-3 border-b border-gray-300 focus:outline-none focus:border-blue-600 bg-transparent"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}

export default InputFeild;
