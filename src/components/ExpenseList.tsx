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
