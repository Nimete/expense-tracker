# Components

## QuickStats
- Source: `src/components/QuickStats.tsx`
- Description: Displays monthly total spent, income, remaining balance, and top category in a 4-column grid
- Props: `expenses: Expense[]`, `currency: string`

```tsx
"use client";

import { Expense, CATEGORY_COLORS, CATEGORY_LABELS, ExpenseCategory } from "@/lib/types";

interface QuickStatsProps {
  expenses: Expense[];
  currency: string;
}

export default function QuickStats({ expenses, currency }: QuickStatsProps) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const totalSpent = monthExpenses
    .filter((e) => e.category !== "salary")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = monthExpenses
    .filter((e) => e.category === "salary")
    .reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalIncome - totalSpent;

  const categoryTotals = monthExpenses
    .filter((e) => e.category !== "salary")
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="sharp-card p-4">
        <p className="stat-label mb-1">Total Spent</p>
        <p className="text-2xl font-bold font-mono tracking-tighter">
          {currency} {totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="sharp-card p-4">
        <p className="stat-label mb-1">Total Income</p>
        <p className="text-2xl font-bold font-mono tracking-tighter text-[#22c55e]">
          {currency} {totalIncome.toFixed(2)}
        </p>
      </div>

      <div className="sharp-card p-4">
        <p className="stat-label mb-1">Remaining</p>
        <p className={`text-2xl font-bold font-mono tracking-tighter ${remaining >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
          {currency} {remaining.toFixed(2)}
        </p>
      </div>

      <div className="sharp-card p-4">
        <p className="stat-label mb-1">Top Category</p>
        {topCategory ? (
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono tracking-tighter">
              {currency} {topCategory[1].toFixed(0)}
            </p>
            <span className="text-[10px] uppercase font-bold" style={{ color: CATEGORY_COLORS[topCategory[0] as ExpenseCategory] }}>
              {CATEGORY_LABELS[topCategory[0] as ExpenseCategory].slice(0, 8)}.
            </span>
          </div>
        ) : (
          <p className="text-2xl font-bold font-mono tracking-tighter text-zinc-700">-</p>
        )}
      </div>
    </div>
  );
}
```

## QuickAdd
- Source: `src/components/QuickAdd.tsx`
- Description: Horizontal scrollable row of one-click expense buttons (Coffee, Lunch, Gas, Netflix, Spotify, Electric Bill)
- Props: `onAdd: (expense: Expense) => void`, `currency: string`

```tsx
"use client";

import { Expense, ExpenseCategory } from "@/lib/types";

interface QuickAddProps {
  onAdd: (expense: Expense) => void;
  currency: string;
}

interface QuickItem {
  name: string;
  amount: number;
  category: ExpenseCategory;
}

const QUICK_ITEMS: QuickItem[] = [
  { name: "Coffee", amount: 4.5, category: "grocery" },
  { name: "Lunch", amount: 12.0, category: "grocery" },
  { name: "Gas", amount: 45.0, category: "grocery" },
  { name: "Netflix", amount: 15.99, category: "subscriptions" },
  { name: "Spotify", amount: 10.99, category: "subscriptions" },
  { name: "Electric Bill", amount: 80.0, category: "finances" },
];

export default function QuickAdd({ onAdd, currency }: QuickAddProps) {
  const handleClick = async (item: QuickItem) => {
    const expense: Expense = {
      id: crypto.randomUUID(),
      name: item.name,
      amount: item.amount,
      category: item.category,
      date: new Date().toISOString().split("T")[0],
      isRecurring: ["Netflix", "Spotify"].includes(item.name),
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await onAdd(expense);
    } catch (err) {
      console.error("Failed to add quick expense:", err);
    }
  };

  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-2">
      <span className="stat-label whitespace-nowrap">Quick Add</span>
      <div className="flex gap-4">
        {QUICK_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item)}
            className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
              ["Netflix", "Spotify"].includes(item.name)
                ? "text-[#8b5cf6] hover:text-[#a78bfa]"
                : "text-zinc-500 hover:text-zinc-100"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## AddExpenseForm
- Source: `src/components/AddExpenseForm.tsx`
- Description: Form for adding new expenses with AI-powered natural language input and manual fields
- Props: `onAdd: (expense: Expense) => void`, `currency: string`

```tsx
"use client";

import { useState } from "react";
import { Expense, ExpenseCategory } from "@/lib/types";
import { parseExpense } from "@/lib/ai";

interface AddExpenseFormProps {
  onAdd: (expense: Expense) => void;
  currency: string;
}

const CATEGORIES: ExpenseCategory[] = ["finances", "subscriptions", "grocery", "salary"];

export default function AddExpenseForm({ onAdd, currency }: AddExpenseFormProps) {
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<ExpenseCategory>("grocery");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const parsed = await parseExpense(aiInput);
      setName(parsed.name);
      setAmount(parsed.amount.toString());
      setDate(parsed.date);
      setCategory(parsed.category);
      setIsRecurring(parsed.isRecurring);
      setAiInput("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to parse. Try manual entry.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name || !amount) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount: parseFloat(amount),
      category,
      date,
      isRecurring,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await onAdd(expense);
      setName("");
      setAmount("");
      setNotes("");
      setIsRecurring(false);
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  return (
    <section className="sharp-card p-6 accent-blue">
      <h2 className="stat-label mb-6">New Transaction</h2>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiParse()}
            placeholder="AI Input..."
            className="minimal-input w-full py-2 text-sm placeholder:text-zinc-700 placeholder:italic"
            disabled={aiLoading}
          />
          <button
            type="button"
            onClick={handleAiParse}
            disabled={aiLoading || !aiInput.trim()}
            className="absolute right-0 top-0 text-[#8b5cf6] text-xs hover:text-[#a78bfa] disabled:opacity-50"
          >
            {aiLoading ? "..." : "✦"}
          </button>
        </div>
        {aiError && (
          <p className="text-[10px] text-[#ef4444] font-mono">{aiError}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Description"
          className="minimal-input w-full py-2 text-sm placeholder:text-zinc-700"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
          min="0"
          className="minimal-input w-full py-2 text-sm font-mono placeholder:text-zinc-700"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="minimal-input w-full py-2 text-[11px] font-mono"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="minimal-input w-full py-2 text-[11px] bg-[#111111]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-[11px] text-zinc-500 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="accent-[#3b82f6]"
          />
          Recurring
        </label>

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="minimal-input w-full py-2 text-sm placeholder:text-zinc-700"
        />

        <button
          type="submit"
          className="minimal-btn w-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-100 hover:text-black hover:border-white transition-all"
        >
          Add Expense
        </button>
      </form>
    </section>
  );
}
```

## ExpenseList
- Source: `src/components/ExpenseList.tsx`
- Description: Filterable/sortable expense history table with search, category filter, and recurring toggle
- Props: `expenses: Expense[]`, `onDelete: (id: string) => void`, `onUpdate: (expense: Expense) => void`, `currency: string`

```tsx
"use client";

import { useState } from "react";
import { Expense, ExpenseCategory, CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { updateExpense } from "@/lib/storage";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (expense: Expense) => void;
  currency: string;
}

const CATEGORIES: ExpenseCategory[] = ["finances", "subscriptions", "grocery", "salary"];

export default function ExpenseList({ expenses, onDelete, onUpdate, currency }: ExpenseListProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">("all");
  const [filterRecurring, setFilterRecurring] = useState<"all" | "recurring" | "one-time">("all");

  const filtered = expenses.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || e.category === filterCategory;
    const matchesRecurring =
      filterRecurring === "all" ||
      (filterRecurring === "recurring" && e.isRecurring) ||
      (filterRecurring === "one-time" && !e.isRecurring);
    return matchesSearch && matchesCategory && matchesRecurring;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleRecurring = async (expense: Expense) => {
    const updated = { ...expense, isRecurring: !expense.isRecurring };
    await updateExpense(updated);
    onUpdate(updated);
  };

  const recurringTotal = expenses
    .filter((e) => e.isRecurring && e.category !== "salary")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <section className="sharp-card overflow-hidden">
      <div className="p-6 border-b border-[#222222] flex justify-between items-center">
        <div>
          <h2 className="stat-label">History</h2>
          {recurringTotal > 0 && (
            <p className="text-[9px] text-zinc-600 font-mono mt-1">
              Recurring: {currency} {recurringTotal.toFixed(2)}/mo
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter..."
            className="bg-transparent text-[10px] uppercase font-bold tracking-widest focus:outline-none text-right"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | "all")}
            className="bg-transparent text-[10px] uppercase font-bold tracking-widest focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <select
            value={filterRecurring}
            onChange={(e) => setFilterRecurring(e.target.value as "all" | "recurring" | "one-time")}
            className="bg-transparent text-[10px] uppercase font-bold tracking-widest focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="recurring">Recurring</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center py-12">
          {expenses.length === 0 ? "No expenses yet" : "No matches"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              <tr className="border-b border-[#222222]">
                <th className="p-6">Description</th>
                <th className="p-6">Date</th>
                <th className="p-6">Category</th>
                <th className="p-6">Recurring</th>
                <th className="p-6 text-right">Amount</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {sorted.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-[#222222] hover:bg-[#18181b] transition-colors"
                >
                  <td className="p-6 font-bold uppercase tracking-tight">{expense.name}</td>
                  <td className="p-6 font-mono text-zinc-500">
                    {new Date(expense.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })}
                  </td>
                  <td className="p-6">
                    <span
                      className="font-bold"
                      style={{ color: CATEGORY_COLORS[expense.category] }}
                    >
                      {CATEGORY_LABELS[expense.category].slice(0, 3).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => toggleRecurring(expense)}
                      className={`text-[9px] font-bold uppercase tracking-widest ${
                        expense.isRecurring ? "text-[#8b5cf6]" : "text-zinc-700"
                      }`}
                    >
                      {expense.isRecurring ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="p-6 text-right font-mono">
                    {currency} {expense.amount.toFixed(2)}
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-[9px] font-bold uppercase tracking-widest text-[#ef4444] hover:text-[#f87171]"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
```

## ChartsPanel
- Source: `src/components/ChartsPanel.tsx`
- Description: Three charts — pie (category allocation), bar (monthly trend), line (daily spending) using Recharts
- Props: `expenses: Expense[]`, `currency: string`

## BudgetTracker
- Source: `src/components/BudgetTracker.tsx`
- Description: Per-category budget bars with set/edit/delete budget and color-coded progress (green/amber/red)
- Props: `expenses: Expense[]`, `currency: string`

## AIInsightsPanel
- Source: `src/components/AIInsightsPanel.tsx`
- Description: AI-powered spending insights with health score, anomalies, top categories, and tips via Groq API
- Props: `expenses: Expense[]`, `currency: string`

## SettingsPanel
- Source: `src/components/SettingsPanel.tsx`
- Description: Footer with CSV export, JSON backup/restore buttons, and record count
- Props: `expenses: Expense[]`, `budgets: Budget[]`, `settings: Settings`, `onRestore: () => void`, `currency: string`
