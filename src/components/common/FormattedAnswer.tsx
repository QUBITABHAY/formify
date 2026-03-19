import React from "react";
import { formatAnswer, isHttpUrl } from "../../utils/formatters";

interface FormattedAnswerProps {
  answer: any;
  fieldType?: string;
  className?: string;
  linkClassName?: string;
}

const FormattedAnswer: React.FC<FormattedAnswerProps> = ({
  answer,
  fieldType,
  className = "",
  linkClassName = "text-blue-600 underline",
}) => {
  const formatted = formatAnswer(answer, fieldType);

  if (isHttpUrl(formatted)) {
    return (
      <a
        href={formatted}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        onClick={(e) => e.stopPropagation()}
      >
        {formatted}
      </a>
    );
  }

  return <span className={className}>{formatted}</span>;
};

export default FormattedAnswer;
