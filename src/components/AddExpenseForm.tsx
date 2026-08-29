"use client";

import { useState } from "react";
import { Expense, ExpenseCategory } from "@/lib/types";
import { parseExpense } from "@/lib/ai";

interface AddExpenseFormProps {
  onAdd: (expense: Expense) => void;
  currency: string;
  userId: string;
}

const CATEGORIES: ExpenseCategory[] = ["finances", "subscriptions", "grocery", "salary"];

export default function AddExpenseForm({ onAdd, currency, userId }: AddExpenseFormProps) {
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
      userId,
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

      {/* AI Quick Entry */}
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

      {/* Manual Form */}
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
