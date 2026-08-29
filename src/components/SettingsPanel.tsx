"use client";

import { useRef, useState } from "react";
import { Expense, Budget, Settings } from "@/lib/types";
import { getAllData, restoreAllData } from "@/lib/storage";

interface SettingsPanelProps {
  expenses: Expense[];
  budgets: Budget[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onRestore: () => void;
  currency: string;
  userId: string;
}

export default function SettingsPanel({ expenses, settings, onSettingsChange, onRestore, currency, userId }: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCapital, setEditingCapital] = useState(false);
  const [capitalInput, setCapitalInput] = useState(settings.capitalAmount.toString());

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
    const data = await getAllData(userId);
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
      await restoreAllData(userId, data);
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
    <footer className="pt-8 space-y-6 border-t border-[#222222]">
      {/* Capital Amount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="stat-label">Monthly Capital</span>
          {editingCapital ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = parseFloat(capitalInput);
                    if (!isNaN(val) && val >= 0) {
                      onSettingsChange({ ...settings, capitalAmount: val });
                      setEditingCapital(false);
                    }
                  }
                  if (e.key === "Escape") {
                    setCapitalInput(settings.capitalAmount.toString());
                    setEditingCapital(false);
                  }
                }}
                className="w-28 px-2 py-1 text-[11px] font-mono bg-transparent border-b border-[#3b82f6] focus:outline-none text-right"
                autoFocus
              />
              <button
                onClick={() => {
                  const val = parseFloat(capitalInput);
                  if (!isNaN(val) && val >= 0) {
                    onSettingsChange({ ...settings, capitalAmount: val });
                    setEditingCapital(false);
                  }
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e] hover:text-[#4ade80]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setCapitalInput(settings.capitalAmount.toString());
                  setEditingCapital(false);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setCapitalInput(settings.capitalAmount.toString());
                setEditingCapital(true);
              }}
              className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
            >
              {currency} {settings.capitalAmount.toFixed(2)}
              <span className="text-[8px] text-zinc-700">✎</span>
            </button>
          )}
        </div>
      </div>

      {/* Export / Backup / Restore */}
      <div className="flex flex-col md:flex-row gap-4">
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
      </div>
    </footer>
  );
}
