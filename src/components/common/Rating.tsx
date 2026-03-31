import { useState } from "react";
import { Icons } from "./icons";
import type { RatingSymbol } from "../BuilderCore/shared/types";

interface RatingProps {
  maxRating?: number;
  ratingSymbol?: RatingSymbol;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  subtitle?: string;
}

const Rating = ({
  maxRating = 5,
  ratingSymbol = "star",
  value = 0,
  onChange,
  disabled = false,
  label,
  subtitle,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  const renderIcon = () => {
    switch (ratingSymbol) {
      case "heart":
        return <Icons.Heart />;
      case "smile":
        return <Icons.Smile />;
      case "thumb":
        return <Icons.Thumb />;
      default:
        return <Icons.Star />;
    }
  };

  const getActiveColor = () => {
    switch (ratingSymbol) {
      case "heart":
        return "text-red-500 fill-red-500";
      case "smile":
        return "text-orange-400 fill-orange-400";
      case "thumb":
        return "text-blue-500 fill-blue-500";
      default:
        return "text-yellow-400 fill-yellow-400";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {subtitle && (
        <p className="text-xs text-gray-500 mb-1">{subtitle}</p>
      )}
      <div className="flex items-center gap-1">
        {stars.map((star) => {
          const isActive = (hoverValue ?? value) >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onMouseEnter={() => !disabled && setHoverValue(star)}
              onMouseLeave={() => !disabled && setHoverValue(null)}
              onClick={() => !disabled && onChange?.(star)}
              className={`
                p-1 transition-all duration-150 outline-none
                ${disabled ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"}
              `}
            >
              <div
                className={`
                  w-8 h-8 flex items-center justify-center
                  ${isActive ? getActiveColor() : "text-gray-300 fill-transparent"}
                `}
              >
                {renderIcon()}
              </div>
            </button>
          );
        })}
        {value > 0 && !disabled && (
          <button
            type="button"
            onClick={() => onChange?.(0)}
            className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Rating;
