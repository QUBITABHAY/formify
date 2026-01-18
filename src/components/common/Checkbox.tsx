import { useState } from "react"

interface CheckboxProps {
    title: string;
    checked?: boolean;
}

function Checkbox({ title, checked = false }: CheckboxProps) {
    const [isChecked, setIsChecked] = useState(checked)
    return (
        <div className="flex items-center gap-2">
            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className='cursor-pointer w-4 h-4' />
            <label className='text-sm font-medium text-gray-900'>{title}</label>
        </div>
    )
}

export default Checkbox