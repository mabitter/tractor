export const formatValue = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return value.toFixed(4);
  }
  return String(value);
};
