"use client";

import { useRef } from "react";
import { Expense, Budget, Settings } from "@/lib/types";
import { getAllData, restoreAllData } from "@/lib/storage";

interface SettingsPanelProps {
  expenses: Expense[];
  budgets: Budget[];
  settings: Settings;
  onRestore: () => void;
  currency: string;
}

export default function SettingsPanel({ expenses, settings, onRestore, currency }: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportCSV = () => {
    const headers = ["Name", "Date", "Amount", "Category", "Recurring", "Notes"];
    const rows = expenses.map((e) => [
      e.name,
      e.date,
      e.amount.toFixed(2),
      e.category,
      e.isRecurring ? "Yes" : "No",
      e.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const backupData = async () => {
    const data = await getAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const restoreData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.expenses || !Array.isArray(data.expenses)) {
        throw new Error("Invalid backup file");
      }
      await restoreAllData(data);
      onRestore();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore. Invalid file.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <footer className="pt-8 flex flex-col md:flex-row gap-4 border-t border-[#222222]">
      <button
        onClick={exportCSV}
        disabled={expenses.length === 0}
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-100 transition-colors flex items-center gap-2 disabled:opacity-30"
      >
        ↓ Export CSV
      </button>
      <button
        onClick={backupData}
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-100 transition-colors flex items-center gap-2"
      >
        ↓ Backup
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-100 transition-colors flex items-center gap-2"
      >
        ↑ Restore
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={restoreData}
        className="hidden"
      />
      <div className="ml-auto text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">
        {expenses.length} records • {settings.currency}
      </div>
    </footer>
  );
}
