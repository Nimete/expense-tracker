import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsPanel from "@/components/SettingsPanel";
import { Expense, Settings } from "@/lib/types";

// Mock the storage module
vi.mock("@/lib/storage", () => ({
  getAllData: vi.fn(() =>
    Promise.resolve({
      expenses: [],
      budgets: [],
      settings: { currency: "USD", theme: "dark" },
    })
  ),
  restoreAllData: vi.fn(() => Promise.resolve()),
}));

// Mock URL.createObjectURL and related methods
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
Object.defineProperty(URL, "createObjectURL", {
  value: () => "blob:mock-url",
  writable: true,
});
Object.defineProperty(URL, "revokeObjectURL", {
  value: mockRevokeObjectURL,
  writable: true,
});

// Mock document.createElement
const originalCreateElement = document.createElement.bind(document);
vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
  const element = originalCreateElement(tagName);
  if (tagName === "a") {
    element.click = mockClick;
  }
  return element;
});

describe("SettingsPanel Component", () => {
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

  const mockSettings: Settings = {
    currency: "USD",
    theme: "dark",
  };

  const mockOnRestore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the settings panel", () => {
    render(
      <SettingsPanel
        expenses={mockExpenses}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    expect(screen.getByText(/Export CSV/)).toBeInTheDocument();
    expect(screen.getByText(/Backup/)).toBeInTheDocument();
    expect(screen.getByText(/Restore/)).toBeInTheDocument();
  });

  it("should display record count", () => {
    render(
      <SettingsPanel
        expenses={mockExpenses}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    expect(screen.getByText(/1 records/)).toBeInTheDocument();
  });

  it("should display currency", () => {
    render(
      <SettingsPanel
        expenses={mockExpenses}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    expect(screen.getByText(/USD/)).toBeInTheDocument();
  });

  it("should export CSV when Export CSV is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        expenses={mockExpenses}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    const exportButton = screen.getByText(/Export CSV/);
    await user.click(exportButton);
    
    expect(mockClick).toHaveBeenCalled();
  });

  it("should backup data when Backup is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        expenses={mockExpenses}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    const backupButton = screen.getByText(/Backup/);
    await user.click(backupButton);
    
    expect(mockClick).toHaveBeenCalled();
  });

  it("should disable Export CSV when no expenses", () => {
    render(
      <SettingsPanel
        expenses={[]}
        budgets={[]}
        settings={mockSettings}
        onRestore={mockOnRestore}
        currency="USD"
      />
    );
    
    const exportButton = screen.getByText(/Export CSV/);
    expect(exportButton).toBeDisabled();
  });
});
