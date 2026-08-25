# Extractable Components

## Layout Components

### DashboardHeader
- Source: `src/app/page.tsx` (inline, lines 119-156)
- Category: layout
- Description: Sticky top header with title, currency toggle, theme toggle, and auth controls
- Extractable props: `title` (string, default: "Dashboard"), `currency` (string), `theme` ("light"|"dark"), `isSignedIn` (boolean), `userName` (string)
- Hardcoded: "Dashboard" text, border styles, max-w-5xl, all CSS classes

### QuickStatsGrid
- Source: `src/components/QuickStats.tsx`
- Category: layout
- Description: 4-column stat cards grid showing monthly financial summary
- Extractable props: `stats` (array of {label, value, color?})
- Hardcoded: Grid layout (2-col mobile, 4-col desktop), sharp-card styling

## Basic Components

### SharpCard
- Source: used across all components via CSS class
- Category: basic
- Description: Dark card container with border, no border-radius
- Extractable props: `accent` ("blue"|"purple"|"green"|"amber"|none), `children`
- Hardcoded: `background-color: #111111`, `border: 1px solid #222222`, `border-radius: 0`

### StatLabel
- Source: used across all components via CSS class
- Category: basic
- Description: Uppercase tiny label for stats and section headers
- Extractable props: `children`
- Hardcoded: `text-transform: uppercase`, `letter-spacing: 0.05em`, `font-size: 10px`, `color: #a1a1aa`

### MinimalButton
- Source: used in header and footer via CSS class
- Category: basic
- Description: Transparent button with border, dark hover state
- Extractable props: `children`, `onClick`, `disabled`
- Hardcoded: All CSS classes

### MinimalInput
- Source: used in forms via CSS class
- Category: basic
- Description: Underline-only input with blue focus state
- Extractable props: `value`, `onChange`, `placeholder`, `type`
- Hardcoded: All CSS classes

### CategoryBadge
- Source: `src/components/ExpenseList.tsx`
- Category: basic
- Description: Colored category label (3-letter uppercase abbreviation)
- Extractable props: `category` (ExpenseCategory)
- Hardcoded: Category color map, label map

### QuickAddBar
- Source: `src/components/QuickAdd.tsx`
- Category: basic
- Description: Horizontal scrollable row of one-click expense buttons
- Extractable props: `items` (array of {name, amount, category}), `onAdd`
- Hardcoded: QUICK_ITEMS data, purple color for subscriptions
