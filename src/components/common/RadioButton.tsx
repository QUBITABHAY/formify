interface RadioButtonProps {
    title: string;
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
}

function RadioButton({ title, name, value, checked, onChange }: RadioButtonProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange && onChange(value)}
                className="cursor-pointer w-5 h-5 text-blue-600"
            />
            <span className="text-sm font-normal text-gray-700">{title}</span>
        </label>
    )
}

export default RadioButton