interface RadioButtonProps {
    title: string;
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
}

function RadioButton({ title, name, value, checked, onChange }: RadioButtonProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange && onChange(value)}
                className="cursor-pointer w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-900">{title}</span>
        </label>
    )
}

export default RadioButton