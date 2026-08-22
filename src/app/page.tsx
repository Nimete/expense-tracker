"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Expense, Settings } from "@/lib/types";
import { getAllExpenses, addExpense, deleteExpense, updateExpense, getSettings, saveSettings } from "@/lib/storage";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import QuickStats from "@/components/QuickStats";
import ChartsPanel from "@/components/ChartsPanel";
import BudgetTracker from "@/components/BudgetTracker";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import SettingsPanel from "@/components/SettingsPanel";
import QuickAdd from "@/components/QuickAdd";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>({ currency: "USD", theme: "light" });
  const [loaded, setLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [loadedExpenses, loadedSettings] = await Promise.all([
          getAllExpenses(),
          getSettings(),
        ]);

        if (!active) return;

        setExpenses(loadedExpenses || []);
        if (loadedSettings) {
          setSettings({
            currency: loadedSettings.currency,
            theme: loadedSettings.theme === "dark" ? "dark" : "light",
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (!active) return;

        setExpenses([]);
        setSettings({ currency: "USD", theme: "light" });
      } finally {
        if (active) {
          setLoaded(true);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", settings.theme === "dark");
      localStorage.setItem("theme", settings.theme);
    }
  }, [settings.theme, loaded]);

  const handleAdd = async (expense: Expense) => {
    try {
      await addExpense(expense);
      setExpenses((prev) => [...prev, expense]);
    } catch (err) {
      console.error("Failed to save expense:", err);
      throw err;
    }
  };

  const handleUpdate = async (expense: Expense) => {
    await updateExpense(expense);
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRestore = async () => {
    const loadedExpenses = await getAllExpenses();
    setExpenses(loadedExpenses);
    setRefreshKey((k) => k + 1);
  };

  const toggleTheme = async () => {
    const newTheme: "light" | "dark" = settings.theme === "light" ? "dark" : "light";
    const newSettings: Settings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const cycleCurrency = async () => {
    const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
    const idx = currencies.indexOf(settings.currency);
    const newCurrency = currencies[(idx + 1) % currencies.length];
    const newSettings: Settings = { ...settings, currency: newCurrency };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 transition-colors duration-150">
      <header className="bg-[#0a0a0a] border-b border-[#222222] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={cycleCurrency}
              className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
            >
              {settings.currency}
            </button>
            <button
              onClick={toggleTheme}
              className="text-zinc-500 hover:text-zinc-100 transition-colors"
              aria-label="Toggle theme"
            >
              {settings.theme === "light" ? "🌙" : "☀️"}
            </button>
            {!isSignedIn ? (
              <>
                <button
                  onClick={() => openSignIn()}
                  className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openSignUp()}
                  className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</span>
                <button
                  onClick={() => signOut()}
                  className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <QuickStats expenses={expenses} currency={settings.currency} />
        <QuickAdd onAdd={handleAdd} currency={settings.currency} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <AddExpenseForm onAdd={handleAdd} currency={settings.currency} />
            <AIInsightsPanel expenses={expenses} currency={settings.currency} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <ChartsPanel expenses={expenses} currency={settings.currency} />
            <div key={refreshKey}>
              <BudgetTracker expenses={expenses} currency={settings.currency} />
            </div>
            <ExpenseList expenses={expenses} onDelete={handleDelete} onUpdate={handleUpdate} currency={settings.currency} />
          </div>
        </div>

        <SettingsPanel
          expenses={expenses}
          budgets={[]}
          settings={settings}
          onRestore={handleRestore}
          currency={settings.currency}
        />
      </main>
    </div>
  );
}
