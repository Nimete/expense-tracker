"use client";

import { useState, useEffect } from "react";
import { Expense, Budget, ExpenseCategory, CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { getBudgets, setBudget, deleteBudget } from "@/lib/storage";

interface BudgetTrackerProps {
  expenses: Expense[];
  currency: string;
  userId: string;
}

const CATEGORIES: ExpenseCategory[] = ["finances", "subscriptions", "grocery", "salary"];

export default function BudgetTracker({ expenses, currency, userId }: BudgetTrackerProps) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editCategory, setEditCategory] = useState<ExpenseCategory | null>(null);
  const [limitInput, setLimitInput] = useState("");

  useEffect(() => {
    if (userId) {
      getBudgets(userId, currentMonth).then(setBudgets);
    }
  }, [currentMonth, userId]);

  const monthExpenses = expenses.filter(
    (e) => e.date.startsWith(currentMonth) && e.category !== "salary"
  );

  const spendingByCategory = monthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveBudget = async () => {
    if (!editCategory || !limitInput) return;
    const limit = parseFloat(limitInput);
    if (isNaN(limit) || limit <= 0) return;

    const existing = budgets.find((b) => b.category === editCategory);
    const budget: Budget = {
      id: existing?.id || crypto.randomUUID(),
      userId,
      category: editCategory,
      monthlyLimit: limit,
      month: currentMonth,
    };

    await setBudget(budget);
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === editCategory);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = budget;
        return next;
      }
      return [...prev, budget];
    });
    setEditCategory(null);
    setLimitInput("");
  };

  const handleDeleteBudget = async (id: string) => {
    await deleteBudget(id, userId);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const getProgressColor = (percent: number) => {
    if (percent < 75) return "#22c55e";
    if (percent < 90) return "#f59e0b";
    return "#ef4444";
  };

  const startEditing = (category: ExpenseCategory, currentLimit: number) => {
    setEditCategory(category);
    setLimitInput(currentLimit > 0 ? currentLimit.toString() : "");
  };

  return (
    <section className="sharp-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="stat-label">Budget Tracker</h2>
        <span className="text-[9px] font-mono text-zinc-600 uppercase">{currentMonth}</span>
      </div>

      <div className="space-y-6">
        {CATEGORIES.filter((c) => c !== "salary").map((category) => {
          const budget = budgets.find((b) => b.category === category);
          const spent = spendingByCategory[category] || 0;
          const limit = budget?.monthlyLimit || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isEditing = editCategory === category;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-1 h-4"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {CATEGORY_LABELS[category]}
                  </span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={limitInput}
                      onChange={(e) => setLimitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveBudget();
                        if (e.key === "Escape") setEditCategory(null);
                      }}
                      placeholder="Limit"
                      className="w-24 px-2 py-1 text-[11px] font-mono bg-transparent border-b border-[#3b82f6] focus:outline-none text-right"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveBudget}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e] hover:text-[#4ade80]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditCategory(null)}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(category, limit)}
                    className="flex items-center gap-2 text-[11px] font-mono hover:text-white transition-colors group"
                  >
                    <span>{currency} {spent.toFixed(2)}</span>
                    {limit > 0 && (
                      <>
                        <span className="text-zinc-600">/</span>
                        <span className="text-zinc-500 group-hover:text-zinc-300">{currency} {limit.toFixed(2)}</span>
                      </>
                    )}
                    <span className="text-[8px] text-zinc-700 group-hover:text-zinc-500">✎</span>
                  </button>
                )}
              </div>

              {limit > 0 ? (
                <div
                  className="w-full h-1 bg-[#18181b] cursor-pointer hover:h-1.5 transition-all"
                  onClick={() => startEditing(category, limit)}
                >
                  <div
                    className="h-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: getProgressColor(percent) }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => startEditing(category, 0)}
                  className="text-[9px] text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
                >
                  + Set budget
                </button>
              )}

              {isEditing && budget && (
                <button
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="text-[9px] font-bold uppercase tracking-widest text-[#ef4444] hover:text-[#f87171] mt-1"
                >
                  Remove budget
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
