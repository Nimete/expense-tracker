# Routes

| URL Path | Component File | Layout | Description |
|----------|---------------|--------|-------------|
| `/` | `src/app/page.tsx` | Root Layout | Main dashboard — stats, quick add, forms, charts, budget, expense list |
| `/sign-in/[[...sign-in]]` | `src/app/sign-in/[[...sign-in]]/page.tsx` | Root Layout | Clerk sign-in page |
| `/sign-up/[[...sign-up]]` | `src/app/sign-up/[[...sign-up]]/page.tsx` | Root Layout | Clerk sign-up page |
| `/api/expenses` | `src/app/api/expenses/route.ts` | — | CRUD API for expenses (MongoDB) |
| `/api/budgets` | `src/app/api/budgets/route.ts` | — | CRUD API for budgets (MongoDB) |
| `/api/settings` | `src/app/api/settings/route.ts` | — | GET/POST API for settings (MongoDB) |
| `/api/groq` | `src/app/api/groq/route.ts` | — | POST API for AI parsing and insights (Groq) |

## Route Notes
- All page routes use the Root Layout with `ClerkProvider`
- API routes are excluded from Clerk middleware via proxy matcher
- The `/` route is the main (and only) authenticated page
- Sign-in/sign-up are public Clerk-hosted flows
