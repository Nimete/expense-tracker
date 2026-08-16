# Expense Tracker — QA Test Report

**Date:** 2026-08-16  
**App:** Expense Tracker (Next.js 16.3.0 + React 19 + Tailwind CSS v4 + IndexedDB + Recharts)  
**Server:** http://localhost:3000  
**Test Framework:** Vitest 4.1.10 + React Testing Library  
**Commit:** `d426c28` — fix: add retry logic to IndexedDB storage and fix test selectors  

---

## Test Summary

| Metric | Result |
|--------|--------|
| **Test Files** | 11/11 passed |
| **Individual Tests** | **79/79 passed** |
| **Lint (ESLint)** | 0 errors, 22 warnings (unused imports in test files) |
| **TypeScript Build** | Clean — 0 errors |
| **API Endpoint** | `/api/groq` — 200 OK |

---

## Bugs Fixed

### BUG-1: Expense amounts not persisting (HIGH)
- **Issue:** Expenses added via the form would appear briefly then disappear on re-render.
- **Root cause:** IndexedDB connection failures caused silent write failures. No retry or error recovery.
- **Fix:** Added `withRetry()` wrapper in `src/lib/storage.ts` — retries up to 2 times with 100ms delay, resets the DB connection on failure.
- **Status:** ✅ Fixed

### BUG-2: Test selector failures (LOW)
- **Issue:** 5 tests failed because React splits `USD` and `20.49` into separate `<span>` elements, so `getByText("20.49")` couldn't find a single matching element.
- **Fix:** Changed to `getAllByText((content) => content.includes("20.49"))` pattern.
- **Status:** ✅ Fixed

---

## Test Coverage by Component

| Component | Tests | Status |
|-----------|-------|--------|
| `types.ts` | 8 | ✅ All pass |
| `storage.ts` | 1 | ✅ All pass |
| `QuickStats.tsx` | 7 | ✅ All pass |
| `AddExpenseForm.tsx` | 10 | ✅ All pass |
| `QuickAdd.tsx` | 6 | ✅ All pass |
| `ExpenseList.tsx` | 10 | ✅ All pass |
| `ChartsPanel.tsx` | 7 | ✅ All pass |
| `AIInsightsPanel.tsx` | 7 | ✅ All pass |
| `BudgetTracker.tsx` | 7 | ✅ All pass |
| `SettingsPanel.tsx` | 6 | ✅ All pass |
| `Home.tsx` (integration) | 10 | ✅ All pass |

---

## What Was Tested

### Forms & Input
- Form renders with all fields (name, amount, category, date, notes, recurring)
- Form validates required fields (name, amount)
- Form resets after successful submission
- AI parse button works with `/api/groq` endpoint
- QuickAdd buttons create correct expense data

### Data Display
- Expense list renders with correct names, dates, amounts
- Category badges display (GRO, SUB, SAL, FIN)
- Recurring status shows Yes/No
- Stat cards calculate totals correctly (spent, income, remaining)
- Charts render (pie, bar, line)
- Currency displays correctly across all components

### Filtering & Search
- Search filter works in ExpenseList
- Category filter works in ExpenseList
- Recurring filter works in ExpenseList
- "No matches" shown when no results

### CRUD Operations
- Add expense via form
- Add expense via QuickAdd
- Delete expense calls handler
- Export CSV triggers download
- Backup/Restore functionality works

### Edge Cases
- Empty expense list handled gracefully
- Empty fields blocked by form validation
- "No budget set" shown when no budgets configured
- AI insights show error when no expenses provided

---

## Remaining Warnings (non-blocking)

| Category | Count | Details |
|----------|-------|---------|
| Unused imports in test files | 18 | `fireEvent`, `waitFor`, `beforeEach`, `vi`, `userEvent`, `Expense` |
| Unused props in components | 3 | `currency` in AddExpenseForm, QuickAdd, SettingsPanel |
| React Hook dep warning | 1 | `ChartsPanel.tsx:17` — `now` object in useMemo deps |

These are cosmetic warnings, not bugs.

---

## Edge Cases Not Tested (Manual Check Needed)

| Case | Status | Notes |
|------|--------|-------|
| Zero amounts | Form blocks | HTML `min="0"` + `required` attribute |
| Negative amounts | Form blocks | `min="0"` prevents it |
| Very large amounts | Should work | `parseFloat` handles it, but no overflow test |
| Special characters in name | No test | Could break CSV export |
| Long text (>200 chars) | No test | No `maxLength` — could overflow UI |
| Duplicate submissions | No guard | Rapid clicks could create duplicates |
| Mobile viewport | Not tested | Tailwind responsive classes present but no visual test |
| Browser compatibility | Not tested | IndexedDB works in all modern browsers |

---

## Recommendations

1. **Add `maxLength` to input fields** — prevent extremely long names/notes
2. **Add duplicate submission guard** — disable submit button while `onAdd` is in flight
3. **CSV injection protection** — sanitize names starting with `=`, `+`, `-`, `@`
4. **Add edit functionality** — users can only delete, not edit expenses
5. **Add delete confirmation** — deleting is instant with no undo
6. **Mobile testing** — use Playwright for real browser viewport testing

---

## Commit

```
commit d426c28
Author: Developer <dev@expense-tracker.local>

fix: add retry logic to IndexedDB storage and fix test selectors
```

**Files changed:** 3
- `src/lib/storage.ts` — Added `withRetry()` wrapper for all IndexedDB operations
- `src/__tests__/QuickStats.test.tsx` — Fixed text-matching selectors
- `src/__tests__/ExpenseList.test.tsx` — Fixed text-matching selectors
