import { describe, it, expect, beforeEach, vi } from "vitest";
import { Expense, ExpenseCategory, CATEGORY_COLORS, CATEGORY_LABELS, CURRENCIES } from "@/lib/types";

describe("Types and Constants", () => {
  describe("ExpenseCategory", () => {
    it("should have all required categories", () => {
      const categories: ExpenseCategory[] = ["finances", "subscriptions", "grocery", "salary"];
      expect(categories).toHaveLength(4);
      expect(categories).toContain("finances");
      expect(categories).toContain("subscriptions");
      expect(categories).toContain("grocery");
      expect(categories).toContain("salary");
    });
  });

  describe("CATEGORY_COLORS", () => {
    it("should have colors for all categories", () => {
      expect(CATEGORY_COLORS).toHaveProperty("finances");
      expect(CATEGORY_COLORS).toHaveProperty("subscriptions");
      expect(CATEGORY_COLORS).toHaveProperty("grocery");
      expect(CATEGORY_COLORS).toHaveProperty("salary");
    });

    it("should have valid hex colors", () => {
      Object.values(CATEGORY_COLORS).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe("CATEGORY_LABELS", () => {
    it("should have labels for all categories", () => {
      expect(CATEGORY_LABELS).toHaveProperty("finances");
      expect(CATEGORY_LABELS).toHaveProperty("subscriptions");
      expect(CATEGORY_LABELS).toHaveProperty("grocery");
      expect(CATEGORY_LABELS).toHaveProperty("salary");
    });

    it("should have capitalized labels", () => {
      expect(CATEGORY_LABELS.finances).toBe("Finances");
      expect(CATEGORY_LABELS.subscriptions).toBe("Subscriptions");
      expect(CATEGORY_LABELS.grocery).toBe("Grocery");
      expect(CATEGORY_LABELS.salary).toBe("Salary");
    });
  });

  describe("CURRENCIES", () => {
    it("should include USD", () => {
      expect(CURRENCIES).toContain("USD");
    });

    it("should have at least 6 currencies", () => {
      expect(CURRENCIES.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("Expense interface", () => {
    it("should create a valid expense object", () => {
      const expense: Expense = {
        id: "test-id",
        name: "Test Expense",
        amount: 25.5,
        category: "grocery",
        date: "2026-08-15",
        isRecurring: false,
        notes: "Test notes",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(expense.id).toBe("test-id");
      expect(expense.name).toBe("Test Expense");
      expect(expense.amount).toBe(25.5);
      expect(expense.category).toBe("grocery");
      expect(expense.date).toBe("2026-08-15");
      expect(expense.isRecurring).toBe(false);
      expect(expense.notes).toBe("Test notes");
    });
  });
});
