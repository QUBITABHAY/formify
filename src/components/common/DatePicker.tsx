import { useState, useRef, useEffect } from "react";

interface DatePickerProp {
  label: string;
  name?: string;
  value?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  subtitle?: string;
}

function DatePicker({
  label,
  name,
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  subtitle,
}: DatePickerProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      if (y && m && d) return new Date(Number(y), Number(m) - 1, Number(d));
    }
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value
    ? (() => {
        const [y, m, d] = value.split("-");
        return new Date(Number(y), Number(m) - 1, Number(d));
      })()
    : null;
  const minDate = min ? new Date(`${min}T00:00:00`) : null;
  const maxDate = max ? new Date(`${max}T23:59:59`) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999)))
      return true;
    return false;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    if (isDateDisabled(newDate)) return;

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dayStr}`;

    const syntheticEvent = {
      target: { value: formattedDate, name },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="flex flex-col w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-normal text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {subtitle && <p className="text-base text-gray-500 mb-2">{subtitle}</p>}

      <div className="relative">
        <input type="hidden" id={name} name={name} value={value || ""} />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full p-3 pr-10 text-left
            border-b border-gray-300
            bg-transparent
            text-gray-900
            focus:outline-none focus:border-gray-900
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200
            ${!value ? "text-gray-400" : ""}
          `}
        >
          {value ? formatDisplayDate(value) : "Select a date"}
        </button>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-900"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="font-semibold text-gray-800">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-900"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 p-2 border-b border-gray-100">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 p-2">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day,
                );
                const isDisabled = isDateDisabled(date);
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear();
                const isToday =
                  new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`
                      w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150
                      ${
                        isSelected
                          ? "bg-gray-900 text-white shadow-md"
                          : isToday
                            ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                            : isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  if (!isDateDisabled(today)) {
                    setCurrentMonth(today);
                    handleDateSelect(today.getDate());
                  }
                }}
                className="w-full py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker;
