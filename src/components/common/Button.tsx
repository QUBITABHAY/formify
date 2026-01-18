interface ButtonProp {
    title: string;
    onClick: () => void;
    bgColor?: string;
    textColor?: string;
}

function Button({ title, onClick, bgColor = 'bg-blue-500', textColor = 'text-white' }: ButtonProp) {
    return (
        <button onClick={onClick} className={`flex px-4 py-2 rounded-lg cursor-pointer ${bgColor} ${textColor}`}>
            <p className='font-medium'>{title}</p>
        </button>
    )
}

export default Button