interface CheckboxProps {
  title: string;
  checked?: boolean;
  name?: string;
  onChange?: (checked: boolean) => void;
  subtitle?: string;
  disabled?: boolean;
}

function Checkbox({
  title,
  checked = false,
  subtitle,
  onChange,
  disabled,
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="cursor-pointer w-5 h-5 text-gray-900"
        />
        <label className="text-sm font-normal text-gray-700">{title}</label>
      </div>
      {subtitle && <p className="text-base text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default Checkbox;
