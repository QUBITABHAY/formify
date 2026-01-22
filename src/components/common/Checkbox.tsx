interface CheckboxProps {
    title: string;
    checked?: boolean;
    name?: string;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
}

function Checkbox({ title, checked = false, onChange, disabled }: CheckboxProps) {
    return (
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
                disabled={disabled}
                className='cursor-pointer w-5 h-5 text-blue-600'
            />
            <label className='text-sm font-normal text-gray-700'>{title}</label>
        </div>
    )
}

export default Checkbox