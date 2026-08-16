import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import { Expense } from "@/lib/types";

// Mock the ai module
vi.mock("@/lib/ai", () => ({
  getInsights: vi.fn(() =>
    Promise.resolve({
      topCategories: [{ category: "grocery", amount: 100 }],
      anomalies: ["High spending on coffee"],
      tip: "Reduce dining out",
      healthScore: 7,
      healthExplanation: "Good spending habits",
    })
  ),
}));

describe("AIInsightsPanel Component", () => {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the insights panel", () => {
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    expect(screen.getByText("AI Insights")).toBeInTheDocument();
    expect(screen.getByText("Get Insights")).toBeInTheDocument();
  });

  it("should show insights after clicking refresh", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText("Health Score")).toBeInTheDocument();
      expect(screen.getByText(/7\/10/)).toBeInTheDocument();
    });
  });

  it("should display health score with correct color", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      const scoreElement = screen.getByText(/7\/10/);
      expect(scoreElement).toHaveClass("text-[#22c55e]");
    });
  });

  it("should display top categories", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText("grocery")).toBeInTheDocument();
    });
  });

  it("should display anomalies", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText("High spending on coffee")).toBeInTheDocument();
    });
  });

  it("should display saving tip", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={mockExpenses} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText(/TIP:/)).toBeInTheDocument();
    });
  });

  it("should show error when no expenses", async () => {
    const user = userEvent.setup();
    render(<AIInsightsPanel expenses={[]} currency="USD" />);
    
    const refreshButton = screen.getByText("Get Insights");
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText("Add some expenses first to get insights.")).toBeInTheDocument();
    });
  });
});
