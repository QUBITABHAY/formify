interface InputFeildProps {
  title: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}

function InputFeild({ title, type = 'text', placeholder, maxLength }: InputFeildProps) {
  return (
    <div className="flex flex-col">
      <label
        className="text-sm font-medium text-gray-900"
      >
        {title}
      </label>
      <input
        type={type}
        className="mt-1 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}

export default InputFeild;
