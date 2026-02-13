interface RadioButtonProps {
  title: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

function RadioButton({
  title,
  name,
  value,
  checked,
  onChange,
  disabled,
}: RadioButtonProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange && onChange(value)}
        disabled={disabled}
        className="cursor-pointer w-5 h-5 text-gray-900"
      />
      <span className="text-sm font-normal text-gray-700">{title}</span>
    </label>
  );
}

export default RadioButton;
