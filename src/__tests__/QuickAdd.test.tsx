import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuickAdd from "@/components/QuickAdd";

describe("QuickAdd Component", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all quick add buttons", () => {
    render(<QuickAdd onAdd={mockOnAdd} currency="USD" />);
    
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Gas")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Spotify")).toBeInTheDocument();
  });

  it("should call onAdd with correct expense data when clicking Coffee", async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAdd={mockOnAdd} currency="USD" />);
    
    const coffeeButton = screen.getByText("Coffee");
    await user.click(coffeeButton);
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Coffee",
        amount: 4.5,
        category: "grocery",
      })
    );
  });

  it("should call onAdd with correct expense data when clicking Netflix", async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAdd={mockOnAdd} currency="USD" />);
    
    const netflixButton = screen.getByText("Netflix");
    await user.click(netflixButton);
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Netflix",
        amount: 15.99,
        category: "subscriptions",
        isRecurring: true,
      })
    );
  });

  it("should set isRecurring true for Netflix and Spotify", async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAdd={mockOnAdd} currency="USD" />);
    
    const netflixButton = screen.getByText("Netflix");
    await user.click(netflixButton);
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        isRecurring: true,
      })
    );
  });

  it("should set isRecurring false for Coffee", async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAdd={mockOnAdd} currency="USD" />);
    
    const coffeeButton = screen.getByText("Coffee");
    await user.click(coffeeButton);
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        isRecurring: false,
      })
    );
  });

  it("should have Quick Add label", () => {
    render(<QuickAdd onAdd={mockOnAdd} currency="EUR" />);
    
    expect(screen.getByText("Quick Add")).toBeInTheDocument();
  });
});
