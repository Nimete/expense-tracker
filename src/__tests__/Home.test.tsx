import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { Expense } from "@/lib/types";

// Mock the storage module
vi.mock("@/lib/storage", () => ({
  getAllExpenses: vi.fn(() => Promise.resolve([])),
  addExpense: vi.fn(() => Promise.resolve()),
  deleteExpense: vi.fn(() => Promise.resolve()),
  updateExpense: vi.fn(() => Promise.resolve()),
  getSettings: vi.fn(() =>
    Promise.resolve({
      currency: "USD",
      theme: "light",
    })
  ),
  saveSettings: vi.fn(() => Promise.resolve()),
  getBudgets: vi.fn(() => Promise.resolve([])),
  setBudget: vi.fn(() => Promise.resolve()),
  deleteBudget: vi.fn(() => Promise.resolve()),
  getAllData: vi.fn(() =>
    Promise.resolve({
      expenses: [],
      budgets: [],
      settings: { currency: "USD", theme: "light" },
    })
  ),
  restoreAllData: vi.fn(() => Promise.resolve()),
}));

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

describe("Home Page Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page with loading state initially", () => {
    render(<Home />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render the page after loading", async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  it("should render all main sections after loading", async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Total Spent")).toBeInTheDocument();
      expect(screen.getByText("Total Income")).toBeInTheDocument();
      expect(screen.getByText("Remaining")).toBeInTheDocument();
      expect(screen.getByText("Top Category")).toBeInTheDocument();
      expect(screen.getByText("Quick Add")).toBeInTheDocument();
      expect(screen.getByText("New Transaction")).toBeInTheDocument();
      expect(screen.getByText("AI Insights")).toBeInTheDocument();
      expect(screen.getByText("Category Allocation")).toBeInTheDocument();
      expect(screen.getByText("Monthly Trend")).toBeInTheDocument();
      expect(screen.getByText("Daily Spending")).toBeInTheDocument();
      expect(screen.getByText("History")).toBeInTheDocument();
    });
  });

  it("should render currency toggle button", async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText("USD")).toBeInTheDocument();
    });
  });

  it("should render theme toggle button", async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
    });
  });

  it("should cycle currency when currency button is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText("USD")).toBeInTheDocument();
    });
    
    const currencyButton = screen.getByText("USD");
    await user.click(currencyButton);
    
    await waitFor(() => {
      expect(screen.getByText("EUR")).toBeInTheDocument();
    });
  });

  it("should add expense via QuickAdd", async () => {
    const user = userEvent.setup();
    const { addExpense } = await import("@/lib/storage");
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText("Coffee")).toBeInTheDocument();
    });
    
    const coffeeButton = screen.getByText("Coffee");
    await user.click(coffeeButton);
    
    expect(addExpense).toHaveBeenCalled();
  });

  it("should add expense via form", async () => {
    const user = userEvent.setup();
    const { addExpense } = await import("@/lib/storage");
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    });
    
    const nameInput = screen.getByPlaceholderText("Description");
    const amountInput = screen.getByPlaceholderText("Amount");
    const submitButton = screen.getByText("Add Expense");
    
    await user.type(nameInput, "Test Expense");
    await user.type(amountInput, "25.50");
    await user.click(submitButton);
    
    expect(addExpense).toHaveBeenCalled();
  });

  it("should render settings section", async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/Export CSV/)).toBeInTheDocument();
      expect(screen.getByText(/Backup/)).toBeInTheDocument();
      expect(screen.getByText(/Restore/)).toBeInTheDocument();
    });
  });
});
