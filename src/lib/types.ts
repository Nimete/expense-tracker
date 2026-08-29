export type ExpenseCategory = "finances" | "subscriptions" | "grocery" | "salary";

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  isRecurring: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  month: string;
}

export interface Settings {
  currency: string;
  theme: "light" | "dark";
  capitalAmount: number;
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  finances: "#3b82f6",
  subscriptions: "#8b5cf6",
  grocery: "#22c55e",
  salary: "#f59e0b",
};

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  finances: "Finances",
  subscriptions: "Subscriptions",
  grocery: "Grocery",
  salary: "Salary",
};

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"] as const;
