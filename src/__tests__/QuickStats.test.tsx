import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuickStats from "@/components/QuickStats";
import { Expense } from "@/lib/types";

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

describe("QuickStats Component", () => {
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
      date: "2026-08-15",
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

  it("should render all stat cards", () => {
    render(<QuickStats expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Remaining")).toBeInTheDocument();
    expect(screen.getByText("Top Category")).toBeInTheDocument();
  });

  it("should calculate total spent correctly", () => {
    render(<QuickStats expenses={mockExpenses} currency="USD" />);
    
    // 4.5 + 15.99 = 20.49 - text is split across spans, use getAllByText to find any element containing the value
    const elements = screen.getAllByText((content) => content.includes("20.49"));
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should calculate total income correctly", () => {
    render(<QuickStats expenses={mockExpenses} currency="USD" />);
    
    const elements = screen.getAllByText((content) => content.includes("4500.00"));
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should calculate remaining correctly", () => {
    render(<QuickStats expenses={mockExpenses} currency="USD" />);
    
    // 4500 - 20.49 = 4479.51
    const elements = screen.getAllByText((content) => content.includes("4479.51"));
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should show top category", () => {
    render(<QuickStats expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText(/Subscrip/)).toBeInTheDocument();
  });

  it("should handle empty expenses", () => {
    render(<QuickStats expenses={[]} currency="USD" />);
    
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("Top Category")).toBeInTheDocument();
  });

  it("should display currency symbol", () => {
    render(<QuickStats expenses={mockExpenses} currency="EUR" />);
    
    // Check that EUR appears in any element (it's in separate spans)
    const eurElements = screen.getAllByText((content) => content.includes("EUR"));
    expect(eurElements.length).toBeGreaterThan(0);
  });
});
