# Layouts

## Root Layout
- Source: `src/app/layout.tsx`
- Description: Root layout with ClerkProvider, Geist fonts, dark mode script, and body wrapper

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "AI-powered expense tracking with smart categorization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 transition-colors">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Dashboard Header (inline in page.tsx)
- Source: `src/app/page.tsx` (lines 119-156)
- Description: Sticky top header with "Dashboard" title, currency toggle, theme toggle, and auth controls
- Note: This is not a separate component — it's rendered inline in the page component

```tsx
<header className="bg-[#0a0a0a] border-b border-[#222222] sticky top-0 z-40">
  <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <h1 className="text-sm font-bold tracking-[0.2em] uppercase">Dashboard</h1>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={cycleCurrency} className="minimal-btn px-3 py-1 text-[11px] font-bold font-mono tracking-tighter">
        {settings.currency}
      </button>
      <button onClick={toggleTheme} className="text-zinc-500 hover:text-zinc-100 transition-colors" aria-label="Toggle theme">
        {settings.theme === "light" ? "🌙" : "☀️"}
      </button>
      {/* Auth controls */}
    </div>
  </div>
</header>
```
