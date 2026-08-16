"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { Expense, CATEGORY_COLORS, CATEGORY_LABELS, ExpenseCategory } from "@/lib/types";

interface ChartsPanelProps {
  expenses: Expense[];
  currency: string;
}

export default function ChartsPanel({ expenses, currency }: ChartsPanelProps) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const pieData = useMemo(() => {
    const monthExpenses = expenses.filter(
      (e) => e.date.startsWith(currentMonth) && e.category !== "salary"
    );
    const categoryTotals = monthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: CATEGORY_LABELS[category as ExpenseCategory],
      value: amount,
      color: CATEGORY_COLORS[category as ExpenseCategory],
    }));
  }, [expenses, currentMonth]);

  const barData = useMemo(() => {
    const months: { month: string; label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short" }).toUpperCase();
      const total = expenses
        .filter((e) => e.date.startsWith(key) && e.category !== "salary")
        .reduce((sum, e) => sum + e.amount, 0);
      months.push({ month: key, label, total });
    }
    return months;
  }, [expenses, now]);

  const lineData = useMemo(() => {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const days: { day: string; amount: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth}-${String(d).padStart(2, "0")}`;
      const dayTotal = expenses
        .filter((e) => e.date === dateStr && e.category !== "salary")
        .reduce((sum, e) => sum + e.amount, 0);
      days.push({ day: d.toString(), amount: dayTotal });
    }
    return days;
  }, [expenses, currentMonth, now]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCurrency = (value: any) => {
    const num = typeof value === "number" ? value : parseFloat(String(value));
    return isNaN(num) ? String(value) : `${currency} ${num.toFixed(0)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div className="sharp-card p-6">
        <h3 className="stat-label mb-8">Category Allocation</h3>
        {pieData.length === 0 ? (
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center py-12">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={formatCurrency}
                contentStyle={{
                  backgroundColor: "#111111",
                  border: "1px solid #222222",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart */}
      <div className="sharp-card p-6">
        <h3 className="stat-label mb-8">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }}
              axisLine={{ stroke: "#222222" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={formatCurrency}
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: 0,
                fontSize: 11,
                fontFamily: "monospace",
              }}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="sharp-card p-6 md:col-span-2">
        <h3 className="stat-label mb-8">Daily Spending</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }}
              axisLine={{ stroke: "#222222" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={formatCurrency}
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: 0,
                fontSize: 11,
                fontFamily: "monospace",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={1}
              dot={{ r: 2, fill: "#8b5cf6" }}
              activeDot={{ r: 4, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
