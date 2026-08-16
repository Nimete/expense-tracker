import { ExpenseCategory } from "./types";

interface ParseResult {
  name: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  isRecurring: boolean;
}

interface InsightsResult {
  topCategories: { category: string; amount: number }[];
  anomalies: string[];
  tip: string;
  healthScore: number;
  healthExplanation: string;
}

export async function parseExpense(text: string): Promise<ParseResult> {
  const today = new Date().toISOString().split("T")[0];

  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "parse-expense",
      data: { text, today },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const { result } = await response.json();
  return result;
}

export async function getInsights(
  expenses: { amount: number; category: string; name: string }[],
  currency: string
): Promise<InsightsResult> {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "insights",
      data: { expenses, currency },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const { result } = await response.json();
  return result;
}
