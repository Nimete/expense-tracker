"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn, signOut } = useClerk();
  const router = useRouter();
  const userId = user?.id || "";
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>({ currency: "USD", theme: "light", capitalAmount: 0 });
  const [loaded, setLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!userId) return;
      try {
        const [loadedExpenses, loadedSettings] = await Promise.all([
          getAllExpenses(userId),
          getSettings(userId),
        ]);

        if (!active) return;

        setExpenses(loadedExpenses || []);
        if (loadedSettings) {
          setSettings({
            currency: loadedSettings.currency,
            theme: loadedSettings.theme === "dark" ? "dark" : "light",
            capitalAmount: loadedSettings.capitalAmount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (!active) return;

        setExpenses([]);
        setSettings({ currency: "USD", theme: "light", capitalAmount: 0 });
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
  }, [userId]);

  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", settings.theme === "dark");
      localStorage.setItem("theme", settings.theme);
    }
  }, [settings.theme, loaded]);

  const handleAdd = async (expense: Expense) => {
    try {
      const expenseWithUser = { ...expense, userId };
      await addExpense(expenseWithUser);
      setExpenses((prev) => [...prev, expenseWithUser]);
    } catch (err) {
      console.error("Failed to save expense:", err);
      throw err;
    }
  };

  const handleUpdate = async (expense: Expense) => {
    const expenseWithUser = { ...expense, userId };
    await updateExpense(expenseWithUser);
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expenseWithUser : e)));
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id, userId);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRestore = async () => {
    const loadedExpenses = await getAllExpenses(userId);
    setExpenses(loadedExpenses);
    setRefreshKey((k) => k + 1);
  };

  const toggleTheme = async () => {
    const newTheme: "light" | "dark" = settings.theme === "light" ? "dark" : "light";
    const newSettings: Settings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    await saveSettings(userId, newSettings);
  };

  const cycleCurrency = async () => {
    const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
    const idx = currencies.indexOf(settings.currency);
    const newCurrency = currencies[(idx + 1) % currencies.length];
    const newSettings: Settings = { ...settings, currency: newCurrency };
    setSettings(newSettings);
    await saveSettings(userId, newSettings);
  };

  const handleSettingsChange = async (newSettings: Settings) => {
    setSettings(newSettings);
    await saveSettings(userId, newSettings);
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
            <button onClick={() => router.push("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 bg-white flex items-center justify-center text-black font-bold text-[10px]">E</div>
              <h1 className="text-sm font-bold tracking-[0.2em] uppercase">Dashboard</h1>
            </button>
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
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</span>
                <button
                  onClick={() => signOut()}
                  className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <QuickStats expenses={expenses} currency={settings.currency} capitalAmount={settings.capitalAmount} />
        <QuickAdd onAdd={handleAdd} currency={settings.currency} userId={userId} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <AddExpenseForm onAdd={handleAdd} currency={settings.currency} userId={userId} />
            <AIInsightsPanel expenses={expenses} currency={settings.currency} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <ChartsPanel expenses={expenses} currency={settings.currency} />
            <div key={refreshKey}>
              <BudgetTracker expenses={expenses} currency={settings.currency} userId={userId} capitalAmount={settings.capitalAmount} />
            </div>
            <ExpenseList expenses={expenses} onDelete={handleDelete} onUpdate={handleUpdate} currency={settings.currency} />
          </div>
        </div>

        <SettingsPanel
          expenses={expenses}
          budgets={[]}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onRestore={handleRestore}
          currency={settings.currency}
          userId={userId}
        />
      </main>
    </div>
  );
}
