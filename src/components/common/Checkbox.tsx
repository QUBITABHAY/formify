interface CheckboxProps {
    title: string;
    checked?: boolean;
    name?: string;
    onChange?: (checked: boolean) => void;
}

function Checkbox({ title, checked = false, onChange }: CheckboxProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
                className='cursor-pointer w-4 h-4'
            />
            <label className='text-sm font-medium text-gray-900'>{title}</label>
        </div>
    )
}

export default Checkbox