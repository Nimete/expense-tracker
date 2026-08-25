# Theme

## Design System Summary

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background (dark mode) |
| Card | `#111111` | Card/panel backgrounds |
| Border | `#222222` | Borders, dividers |
| Hover | `#18181b` | Hover states |
| Text primary | `zinc-50` (#fafafa) | Main text |
| Text secondary | `zinc-400` (#a1a1aa) | Muted text |
| Text muted | `zinc-600` (#52525b) | Labels, disabled |
| Accent blue | `#3b82f6` | Primary accent, focus states |
| Accent purple | `#8b5cf6` | AI features, recurring items |
| Success green | `#22c55e` | Positive values, income |
| Warning amber | `#f59e0b` | Budget warnings |
| Error red | `#ef4444` | Negative values, delete, errors |

### Category Colors
| Category | Color |
|----------|-------|
| Finances | `#3b82f6` (blue) |
| Subscriptions | `#8b5cf6` (purple) |
| Grocery | `#22c55e` (green) |
| Salary | `#f59e0b` (amber) |

### Typography
- **Font Sans**: Geist (`--font-geist-sans`)
- **Font Mono**: Geist Mono (`--font-geist-mono`)
- **Base size**: text-sm (14px)
- **Small labels**: text-[10px] / text-[11px] uppercase tracking-widest
- **Stat labels**: 10px uppercase, 0.05em spacing, zinc-400, weight 600
- **Numbers**: font-mono, tracking-tighter

### Spacing & Layout
- Max width: `max-w-5xl` (1024px)
- Grid: 12-column (`lg:grid-cols-12`)
- Card gap: `gap-8`
- Card padding: `p-6`
- Section gap: `space-y-8`

### Border Radius
- All radius: `0` (sharp corners throughout)

### Shadows
- None — flat design with borders only

### Breakpoints
- `md`: 768px
- `lg`: 1024px

---

## Raw Source: globals.css

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
}

.dark body {
  background-color: #0a0a0a;
}

.stat-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 10px;
  color: #a1a1aa;
  font-weight: 600;
}

.sharp-card {
  background-color: #111111;
  border: 1px solid #222222;
  border-radius: 0;
}

.minimal-btn {
  background: transparent;
  border: 1px solid #3f3f46;
  border-radius: 0;
  transition: all 0.15s ease;
}

.minimal-btn:hover {
  border-color: #52525b;
  background: #18181b;
}

.minimal-input {
  background: transparent;
  border: 0;
  border-bottom: 1px solid #3f3f46;
  border-radius: 0;
}

.minimal-input:focus {
  border-color: #3b82f6;
  outline: none;
}

.accent-blue { border-left: 2px solid #3b82f6; }
.accent-purple { border-left: 2px solid #8b5cf6; }
.accent-green { border-left: 2px solid #22c55e; }
.accent-amber { border-left: 2px solid #f59e0b; }

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: #0a0a0a;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46;
}
::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}
```

## Design Tokens (CSS Variables)
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
}
```
