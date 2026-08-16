import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddExpenseForm from "@/components/AddExpenseForm";

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("AddExpenseForm Component", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form", () => {
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    expect(screen.getByText("New Transaction")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("AI Input...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
  });

  it("should render category dropdown", () => {
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const categorySelect = screen.getByRole("combobox");
    expect(categorySelect).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    expect(screen.getByText("Add Expense")).toBeInTheDocument();
  });

  it("should update form fields on input", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const nameInput = screen.getByPlaceholderText("Description");
    const amountInput = screen.getByPlaceholderText("Amount");
    
    await user.type(nameInput, "Test Expense");
    await user.type(amountInput, "25.50");
    
    expect(nameInput).toHaveValue("Test Expense");
    expect(amountInput).toHaveValue(25.5);
  });

  it("should call onAdd with expense data on submit", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const nameInput = screen.getByPlaceholderText("Description");
    const amountInput = screen.getByPlaceholderText("Amount");
    const submitButton = screen.getByText("Add Expense");
    
    await user.type(nameInput, "Test Expense");
    await user.type(amountInput, "25.50");
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Expense",
          amount: 25.5,
          category: "grocery",
        })
      );
    });
  });

  it("should reset form after successful submission", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const nameInput = screen.getByPlaceholderText("Description");
    const amountInput = screen.getByPlaceholderText("Amount");
    const submitButton = screen.getByText("Add Expense");
    
    await user.type(nameInput, "Test Expense");
    await user.type(amountInput, "25.50");
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(amountInput).toHaveValue(null);
    });
  });

  it("should not submit with empty name", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const amountInput = screen.getByPlaceholderText("Amount");
    const submitButton = screen.getByText("Add Expense");
    
    await user.type(amountInput, "25.50");
    await user.click(submitButton);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("should not submit with empty amount", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const nameInput = screen.getByPlaceholderText("Description");
    const submitButton = screen.getByText("Add Expense");
    
    await user.type(nameInput, "Test Expense");
    await user.click(submitButton);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("should handle recurring checkbox", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const recurringCheckbox = screen.getByRole("checkbox");
    await user.click(recurringCheckbox);
    
    expect(recurringCheckbox).toBeChecked();
  });

  it("should handle notes input", async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm onAdd={mockOnAdd} currency="USD" />);
    
    const notesInput = screen.getByPlaceholderText("Notes (optional)");
    await user.type(notesInput, "Test notes");
    
    expect(notesInput).toHaveValue("Test notes");
  });
});
