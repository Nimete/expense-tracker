"use client";

import { Expense, CATEGORY_COLORS, CATEGORY_LABELS, ExpenseCategory } from "@/lib/types";

interface QuickStatsProps {
  expenses: Expense[];
  currency: string;
  capitalAmount: number;
}

export default function QuickStats({ expenses, currency, capitalAmount }: QuickStatsProps) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const totalSpent = monthExpenses
    .filter((e) => e.category !== "salary")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = monthExpenses
    .filter((e) => e.category === "salary")
    .reduce((sum, e) => sum + e.amount, 0);
  const remaining = capitalAmount > 0 ? capitalAmount - totalSpent : totalIncome - totalSpent;

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
