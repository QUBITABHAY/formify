import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  bgColor?: string;
  textColor?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

function Button({
  title,
  onClick,
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
  children,
  fullWidth = false,
  ...props
}: ButtonProp) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${bgColor} ${textColor} ${
        fullWidth ? "w-full" : ""
      } ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children ? children : <p className="font-medium">{title}</p>}
    </button>
  );
}

export default Button;
