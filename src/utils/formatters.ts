export function isHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatAnswer(answer: unknown, fieldType?: string): string {
  if (
    answer === undefined ||
    answer === null ||
    String(answer).trim() === ""
  ) {
    return "Not Available";
  }

  if (fieldType === "date" && (typeof answer === "string" || answer instanceof Date)) {
    return formatDate(answer);
  }

  if (Array.isArray(answer)) {
    if (answer.length === 0) return "Not Available";
    return answer.join(", ");
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  return String(answer);
}

export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
