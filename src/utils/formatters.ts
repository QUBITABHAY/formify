export function isHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatAnswer(answer: any): string {
  if (
    answer === undefined ||
    answer === null ||
    answer.toString().trim() === ""
  ) {
    return "Not Available";
  }

  if (Array.isArray(answer)) {
    if (answer.length === 0) return "Not Available";
    return answer.join(", ");
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  return answer.toString();
}

export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-IN");
}

export function formatTime(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleTimeString("en-IN");
}
