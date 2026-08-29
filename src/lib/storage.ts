import { Expense, Budget, Settings } from "./types";

const API_BASE = "";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function getAllExpenses(userId: string): Promise<Expense[]> {
  return apiFetch<Expense[]>(`/api/expenses?userId=${encodeURIComponent(userId)}`);
}

export async function getExpensesByMonth(userId: string, month: string): Promise<Expense[]> {
  const all = await getAllExpenses(userId);
  return all.filter((e) => e.date.startsWith(month));
}

export async function getExpensesByCategory(userId: string, category: string): Promise<Expense[]> {
  const all = await getAllExpenses(userId);
  return all.filter((e) => e.category === category);
}

export async function addExpense(expense: Expense): Promise<void> {
  await apiFetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export async function updateExpense(expense: Expense): Promise<void> {
  await apiFetch("/api/expenses", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id: string, userId: string): Promise<void> {
  await apiFetch(`/api/expenses?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export async function getBudgets(userId: string, month: string): Promise<Budget[]> {
  return apiFetch<Budget[]>(`/api/budgets?userId=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`);
}

export async function setBudget(budget: Budget): Promise<void> {
  await apiFetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budget),
  });
}

export async function deleteBudget(id: string, userId: string): Promise<void> {
  await apiFetch(`/api/budgets?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export async function getSettings(userId: string): Promise<Settings | null> {
  return apiFetch<Settings | null>(`/api/settings?userId=${encodeURIComponent(userId)}`);
}

export async function saveSettings(userId: string, settings: Settings): Promise<void> {
  await apiFetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...settings }),
  });
}

export async function getAllData(userId: string) {
  const [expenses, budgets, settings] = await Promise.all([
    getAllExpenses(userId),
    getBudgets(userId, ""),
    getSettings(userId),
  ]);
  return { expenses, budgets, settings };
}

export async function restoreAllData(userId: string, data: {
  expenses: Expense[];
  budgets: Budget[];
  settings: Settings | null;
}) {
  await Promise.all([
    ...data.expenses.map((e) => addExpense({ ...e, userId })),
    ...data.budgets.map((b) => setBudget({ ...b, userId })),
    data.settings ? saveSettings(userId, data.settings) : Promise.resolve(),
  ]);
}
