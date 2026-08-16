import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetTracker from "@/components/BudgetTracker";
import { Expense } from "@/lib/types";

// Mock the storage module
vi.mock("@/lib/storage", () => ({
  getBudgets: vi.fn(() => Promise.resolve([])),
  setBudget: vi.fn(() => Promise.resolve()),
  deleteBudget: vi.fn(() => Promise.resolve()),
}));

describe("BudgetTracker Component", () => {
  const mockExpenses: Expense[] = [
    {
      id: "1",
      name: "Coffee",
      amount: 4.5,
      category: "grocery",
      date: "2026-08-15",
      isRecurring: false,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Netflix",
      amount: 15.99,
      category: "subscriptions",
      date: "2026-08-10",
      isRecurring: true,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the budget tracker", () => {
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText("Budget Tracker")).toBeInTheDocument();
  });

  it("should display all categories except salary", () => {
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText("Finances")).toBeInTheDocument();
    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("Grocery")).toBeInTheDocument();
    expect(screen.queryByText("Salary")).not.toBeInTheDocument();
  });

  it("should show spending amounts for each category", () => {
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText(/4\.50/)).toBeInTheDocument();
    expect(screen.getByText(/15\.99/)).toBeInTheDocument();
  });

  it("should show 'No budget set' when no budget is configured", () => {
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    const noBudgetTexts = screen.getAllByText("No budget set");
    expect(noBudgetTexts.length).toBeGreaterThan(0);
  });

  it("should show 'Set Budget' button for categories without budget", () => {
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    const setBudgetButtons = screen.getAllByText("Set Budget");
    expect(setBudgetButtons.length).toBeGreaterThan(0);
  });

  it("should show budget input when Set Budget is clicked", async () => {
    const user = userEvent.setup();
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    const setBudgetButton = screen.getAllByText("Set Budget")[0];
    await user.click(setBudgetButton);
    
    expect(screen.getByPlaceholderText("Limit")).toBeInTheDocument();
  });

  it("should save budget when Save is clicked", async () => {
    const user = userEvent.setup();
    const { setBudget } = await import("@/lib/storage");
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    const setBudgetButton = screen.getAllByText("Set Budget")[0];
    await user.click(setBudgetButton);
    
    const limitInput = screen.getByPlaceholderText("Limit");
    await user.type(limitInput, "500");
    
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);
    
    expect(setBudget).toHaveBeenCalled();
  });

  it("should cancel budget editing when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<BudgetTracker expenses={mockExpenses} currency="USD" />);
    
    const setBudgetButton = screen.getAllByText("Set Budget")[0];
    await user.click(setBudgetButton);
    
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);
    
    expect(screen.queryByPlaceholderText("Limit")).not.toBeInTheDocument();
  });
});
