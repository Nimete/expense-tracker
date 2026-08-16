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

export async function getAllExpenses(): Promise<Expense[]> {
  return apiFetch<Expense[]>("/api/expenses");
}

export async function getExpensesByMonth(month: string): Promise<Expense[]> {
  const all = await getAllExpenses();
  return all.filter((e) => e.date.startsWith(month));
}

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  const all = await getAllExpenses();
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

export async function deleteExpense(id: string): Promise<void> {
  await apiFetch(`/api/expenses?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getBudgets(month: string): Promise<Budget[]> {
  return apiFetch<Budget[]>(`/api/budgets?month=${encodeURIComponent(month)}`);
}

export async function setBudget(budget: Budget): Promise<void> {
  await apiFetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budget),
  });
}

export async function deleteBudget(id: string): Promise<void> {
  await apiFetch(`/api/budgets?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getSettings(): Promise<Settings | null> {
  return apiFetch<Settings | null>("/api/settings");
}

export async function saveSettings(settings: Settings): Promise<void> {
  await apiFetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export async function getAllData() {
  const [expenses, budgets, settings] = await Promise.all([
    getAllExpenses(),
    apiFetch<Budget[]>("/api/budgets"),
    getSettings(),
  ]);
  return { expenses, budgets, settings };
}

export async function restoreAllData(data: {
  expenses: Expense[];
  budgets: Budget[];
  settings: Settings | null;
}) {
  await Promise.all([
    ...data.expenses.map((e) => addExpense(e)),
    ...data.budgets.map((b) => setBudget(b)),
    data.settings ? saveSettings(data.settings) : Promise.resolve(),
  ]);
}
