# Pages

## `/` (Dashboard)
Entry: `src/app/page.tsx`
Dependencies:
- `src/lib/types.ts`
- `src/lib/storage.ts`
  - `src/app/api/expenses/route.ts` (via fetch)
  - `src/app/api/settings/route.ts` (via fetch)
- `src/components/QuickStats.tsx`
  - `src/lib/types.ts`
- `src/components/QuickAdd.tsx`
  - `src/lib/types.ts`
- `src/components/AddExpenseForm.tsx`
  - `src/lib/types.ts`
  - `src/lib/ai.ts`
- `src/components/AIInsightsPanel.tsx`
  - `src/lib/types.ts`
  - `src/lib/ai.ts`
- `src/components/ChartsPanel.tsx`
  - `src/lib/types.ts`
  - recharts (PieChart, BarChart, LineChart, etc.)
- `src/components/BudgetTracker.tsx`
  - `src/lib/types.ts`
  - `src/lib/storage.ts`
- `src/components/ExpenseList.tsx`
  - `src/lib/types.ts`
  - `src/lib/storage.ts`
- `src/components/SettingsPanel.tsx`
  - `src/lib/types.ts`
  - `src/lib/storage.ts`

## `/sign-in/[[...sign-in]]` (Sign In)
Entry: `src/app/sign-in/[[...sign-in]]/page.tsx`
Dependencies:
- `@clerk/nextjs` (SignIn component)

## `/sign-up/[[...sign-up]]` (Sign Up)
Entry: `src/app/sign-up/[[...sign-up]]/page.tsx`
Dependencies:
- `@clerk/nextjs` (SignUp component)
