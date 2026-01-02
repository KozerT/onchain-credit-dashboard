import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
};

export function sortData<T, K extends keyof T>(
  data: T[],
  field: K | null,
  direction: "asc" | "desc"
) {
  if (!field) return data;

  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;

    const modifier = direction === "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }

    return ((Number(aVal) || 0) - (Number(bVal) || 0)) * modifier;
  });
}

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
};

export const truncateMiddle = (str: string, start = 6, end = 4) => {
  if (!str || str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
};
