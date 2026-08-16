import { describe, it, expect, vi, beforeEach } from "vitest";
import { Expense, Settings } from "@/lib/types";

// Mock the idb module
vi.mock("idb", () => ({
  openDB: vi.fn(() =>
    Promise.resolve({
      objectStoreNames: {
        contains: vi.fn(() => true),
      },
      createObjectStore: vi.fn(),
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          clear: vi.fn(),
          put: vi.fn(),
          getAll: vi.fn(() => Promise.resolve([])),
          get: vi.fn(() => Promise.resolve(null)),
          delete: vi.fn(),
        })),
        done: Promise.resolve(),
      })),
      getAll: vi.fn(() => Promise.resolve([])),
      get: vi.fn(() => Promise.resolve(null)),
      put: vi.fn(() => Promise.resolve()),
      delete: vi.fn(() => Promise.resolve()),
      getAllFromIndex: vi.fn(() => Promise.resolve([])),
    })
  ),
}));

describe("Storage Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export storage functions", async () => {
    const storage = await import("@/lib/storage");
    expect(storage).toHaveProperty("getAllExpenses");
    expect(storage).toHaveProperty("addExpense");
    expect(storage).toHaveProperty("updateExpense");
    expect(storage).toHaveProperty("deleteExpense");
    expect(storage).toHaveProperty("getBudgets");
    expect(storage).toHaveProperty("setBudget");
    expect(storage).toHaveProperty("deleteBudget");
    expect(storage).toHaveProperty("getSettings");
    expect(storage).toHaveProperty("saveSettings");
    expect(storage).toHaveProperty("getAllData");
    expect(storage).toHaveProperty("restoreAllData");
  });
});
