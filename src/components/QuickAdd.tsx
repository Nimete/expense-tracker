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
