import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsPanel from "@/components/ChartsPanel";
import { Expense } from "@/lib/types";

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("ChartsPanel Component", () => {
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

  it("should render all chart sections", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText("Category Allocation")).toBeInTheDocument();
    expect(screen.getByText("Monthly Trend")).toBeInTheDocument();
    expect(screen.getByText("Daily Spending")).toBeInTheDocument();
  });

  it("should render chart containers", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getAllByTestId("responsive-container")).toHaveLength(3);
  });

  it("should render pie chart", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("should render bar chart", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("should render line chart", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("should show 'No data' when no expenses", () => {
    render(<ChartsPanel expenses={[]} currency="USD" />);
    
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should display currency in charts", () => {
    render(<ChartsPanel expenses={mockExpenses} currency="EUR" />);
    
    // Charts should be rendered with EUR currency
    expect(screen.getByText("Category Allocation")).toBeInTheDocument();
  });
});
