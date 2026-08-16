import { openDB, IDBPDatabase } from "idb";
import { Expense, Budget, Settings } from "./types";

const DB_NAME = "expense-tracker";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("expenses")) {
          const expenseStore = db.createObjectStore("expenses", { keyPath: "id" });
          expenseStore.createIndex("date", "date");
          expenseStore.createIndex("category", "category");
        }
        if (!db.objectStoreNames.contains("budgets")) {
          const budgetStore = db.createObjectStore("budgets", { keyPath: "id" });
          budgetStore.createIndex("category", "category");
          budgetStore.createIndex("month", "month");
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "id" });
        }
      },
    }).catch((err) => {
      console.error("Failed to open IndexedDB:", err);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      dbPromise = null;
      await new Promise((r) => setTimeout(r, 100));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
}

export async function getAllExpenses(): Promise<Expense[]> {
  return withRetry(async () => {
    const db = await getDB();
    return db.getAll("expenses");
  });
}

export async function getExpensesByMonth(month: string): Promise<Expense[]> {
  return withRetry(async () => {
    const db = await getDB();
    const all = await db.getAll("expenses");
    return all.filter((e) => e.date.startsWith(month));
  });
}

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  return withRetry(async () => {
    const db = await getDB();
    return db.getAllFromIndex("expenses", "category", category);
  });
}

export async function addExpense(expense: Expense): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.put("expenses", expense);
  });
}

export async function updateExpense(expense: Expense): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.put("expenses", { ...expense, updatedAt: new Date().toISOString() });
  });
}

export async function deleteExpense(id: string): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.delete("expenses", id);
  });
}

export async function getBudgets(month: string): Promise<Budget[]> {
  return withRetry(async () => {
    const db = await getDB();
    const all = await db.getAll("budgets");
    return all.filter((b) => b.month === month);
  });
}

export async function setBudget(budget: Budget): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.put("budgets", budget);
  });
}

export async function deleteBudget(id: string): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.delete("budgets", id);
  });
}

export async function getSettings(): Promise<Settings | null> {
  return withRetry(async () => {
    const db = await getDB();
    return db.get("settings", "main") as Promise<Settings | null>;
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  return withRetry(async () => {
    const db = await getDB();
    await db.put("settings", { id: "main", ...settings });
  });
}

export async function getAllData() {
  return withRetry(async () => {
    const db = await getDB();
    const expenses = await db.getAll("expenses");
    const budgets = await db.getAll("budgets");
    const settings = await db.get("settings", "main");
    return { expenses, budgets, settings };
  });
}

export async function restoreAllData(data: {
  expenses: Expense[];
  budgets: Budget[];
  settings: Settings | null;
}) {
  return withRetry(async () => {
    const db = await getDB();
    const tx = db.transaction(["expenses", "budgets", "settings"], "readwrite");
    await tx.objectStore("expenses").clear();
    await tx.objectStore("budgets").clear();
    await tx.objectStore("settings").clear();
    for (const expense of data.expenses) {
      await tx.objectStore("expenses").put(expense);
    }
    for (const budget of data.budgets) {
      await tx.objectStore("budgets").put(budget);
    }
    if (data.settings) {
      await tx.objectStore("settings").put({ id: "main", ...data.settings });
    }
    await tx.done;
  });
}
