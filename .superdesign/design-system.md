# Design System — Expense Tracker

## Product Context
- AI-powered expense tracking dashboard with smart categorization
- Dark-first, brutalist-minimal aesthetic
- Sharp corners, monospace numbers, uppercase tiny labels
- Tech stack: Next.js 16, React 19, Tailwind 4, MongoDB, Clerk auth, Groq AI

## Color Palette
- Background: `#0a0a0a` (near-black)
- Card: `#111111`
- Border: `#222222`
- Hover: `#18181b`
- Text primary: `zinc-50` (#fafafa)
- Text secondary: `zinc-400` (#a1a1aa)
- Text muted: `zinc-600` (#52525b)
- Accent blue: `#3b82f6` (primary, focus, links)
- Accent purple: `#8b5cf6` (AI features, recurring)
- Success green: `#22c55e` (income, positive)
- Warning amber: `#f59e0b` (budget warnings)
- Error red: `#ef4444` (delete, negative)

## Typography
- Font: Geist Sans (sans-serif), Geist Mono (monospace)
- Base: text-sm (14px)
- Labels: 10px uppercase, 0.05em spacing, zinc-400, weight 600
- Numbers: font-mono, tracking-tighter
- Headings: text-sm font-bold, 0.2em tracking, uppercase

## Spacing & Layout
- Max width: `max-w-5xl` (1024px)
- Grid: 12-column on desktop
- Card padding: p-6
- Section gap: space-y-8
- Border radius: 0 (sharp corners everywhere)

## Component Style
- Cards: `sharp-card` — #111111 bg, #222222 border, no radius
- Buttons: `minimal-btn` — transparent, #3f3f46 border, hover #18181b bg
- Inputs: `minimal-input` — transparent, bottom border only, blue focus
- Accent borders: 2px left border (blue, purple, green, amber)

## Motion
- Subtle transitions: 0.15s ease on hover states
- No animations or transitions beyond hover

## Brand Voice
- Minimal, brutalist, data-focused
- All-caps labels, monospace numbers
- No decorative elements, no shadows, no gradients
