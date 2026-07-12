export const CATEGORIES: { value: string; label: string }[] = [
  { value: "ai", label: "AI" },
  { value: "biomed", label: "Biomedicine" },
  { value: "markets", label: "Markets" },
  { value: "supply-chain", label: "Supply Chain" },
  { value: "science", label: "Science" },
  { value: "math", label: "Math" },
  { value: "other", label: "Other" },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);
