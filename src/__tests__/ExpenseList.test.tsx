import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseList from "@/components/ExpenseList";
import { Expense } from "@/lib/types";

describe("ExpenseList Component", () => {
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
    {
      id: "3",
      name: "Salary",
      amount: 4500,
      category: "salary",
      date: "2026-08-01",
      isRecurring: false,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the expense list", () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });

  it("should display expense amounts in table rows", () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    // Check for amounts in table cells - text is split across spans so use content matcher
    const amount4_50 = screen.getAllByText((content) => content.includes("4.50"));
    const amount15_99 = screen.getAllByText((content) => content.includes("15.99"));
    const amount4500 = screen.getAllByText((content) => content.includes("4500.00"));
    expect(amount4_50.length).toBeGreaterThan(0);
    expect(amount15_99.length).toBeGreaterThan(0);
    expect(amount4500.length).toBeGreaterThan(0);
  });

  it("should display category labels", () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    expect(screen.getByText("GRO")).toBeInTheDocument();
    expect(screen.getByText("SUB")).toBeInTheDocument();
    expect(screen.getByText("SAL")).toBeInTheDocument();
  });

  it("should display recurring status", () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    // Netflix is recurring
    const recurringButtons = screen.getAllByText(/Yes|No/);
    expect(recurringButtons.length).toBeGreaterThan(0);
  });

  it("should filter expenses by search term", async () => {
    const user = userEvent.setup();
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    const searchInput = screen.getByPlaceholderText("Filter...");
    await user.type(searchInput, "Coffee");
    
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.queryByText("Netflix")).not.toBeInTheDocument();
  });

  it("should filter expenses by category", async () => {
    const user = userEvent.setup();
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    // Find the category dropdown (first select with "All" option)
    const categorySelects = screen.getAllByDisplayValue("All");
    const categorySelect = categorySelects[0]; // First select is category
    await user.selectOptions(categorySelect, "subscriptions");
    
    expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    const deleteButtons = screen.getAllByText("Del");
    await user.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("should show empty state when no expenses", () => {
    render(
      <ExpenseList
        expenses={[]}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    expect(screen.getByText("No expenses yet")).toBeInTheDocument();
  });

  it("should show no matches message when filter returns empty", async () => {
    const user = userEvent.setup();
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    const searchInput = screen.getByPlaceholderText("Filter...");
    await user.type(searchInput, "xyznonexistent");
    
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("should display recurring total when there are recurring expenses", () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        currency="USD"
      />
    );
    
    expect(screen.getByText(/Recurring:/)).toBeInTheDocument();
  });
});
