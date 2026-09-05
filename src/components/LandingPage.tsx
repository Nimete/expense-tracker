"use client";

import { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Sparkles, PieChart, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-50">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#222222] px-6 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-bold text-sm">
            E
          </div>
          <span className="text-sm font-extrabold tracking-[0.2em] uppercase">ExpenseTracker</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#ai" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 hover:text-white transition-colors">AI Engine</a>
        </div>
        <div className="flex gap-4">
          <button onClick={() => openSignIn()} className="border border-[#3f3f46] bg-transparent px-6 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#18181b] hover:border-[#3b82f6] transition-all">
            Log In
          </button>
          <button onClick={() => openSignUp()} className="bg-[#3b82f6] text-white px-6 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#2563eb] transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 flex flex-col lg:flex-row gap-16 items-center overflow-hidden">
          <div className="lg:w-[40%] space-y-8 relative z-10">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#3b82f6]">AI-Powered Expense Tracking</p>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-none">
                TRACK SPENDING <br />
                <span className="text-zinc-500">WITHOUT THE NOISE.</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Smart categorization, budget tracking, and visual analytics — all powered by AI. Take control of your finances in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => openSignUp()} className="bg-white text-black px-8 py-4 font-bold uppercase text-sm flex items-center gap-3 justify-center hover:bg-zinc-200 transition-colors">
                Start Tracking →
              </button>
              <button onClick={() => openSignIn()} className="border border-[#3f3f46] bg-transparent px-8 py-4 font-bold uppercase text-sm flex items-center gap-3 justify-center hover:bg-[#18181b] hover:border-[#3b82f6] transition-all">
                Sign In
              </button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="font-mono text-2xl font-bold">4 Categories</div>
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Smart Sorting</div>
              </div>
              <div className="w-px h-8 bg-zinc-800"></div>
              <div>
                <div className="font-mono text-2xl font-bold">AI Insights</div>
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Groq-Powered</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="lg:w-[60%] w-full relative group">
            <div className="bg-[#111111] border border-[#222222] p-1 group-hover:-translate-y-2 transition-transform">
              <div className="bg-[#0a0a0a] border border-[#222222] p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Dashboard / Overview</div>
                  <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.15em]">Real-time</div>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111111] border border-[#222222] p-4 border-l-2 border-l-[#3b82f6]">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Total Spent</div>
                    <div className="font-mono text-xl mt-1">$2,847.00</div>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] p-4 border-l-2 border-l-[#8b5cf6]">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">AI Savings</div>
                    <div className="font-mono text-xl mt-1 text-[#8b5cf6]">$412.50</div>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] p-4 border-l-2 border-l-[#22c55e]">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Income</div>
                    <div className="font-mono text-xl mt-1 text-[#22c55e]">$5,200.00</div>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] p-4 border-l-2 border-l-[#f59e0b]">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Budgets</div>
                    <div className="font-mono text-xl mt-1">3 Active</div>
                  </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-[#111111] border border-[#222222] p-4 h-48">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 mb-4">Monthly Trend</div>
                    <div className="flex items-end gap-1 h-28 w-full">
                      {[40, 65, 45, 80, 55, 70, 35, 60, 75, 50, 85, 45].map((h, i) => (
                        <div key={i} className={`w-full ${i === 9 ? "bg-[#3b82f6]" : "bg-zinc-800"}`} style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] p-4 h-48 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 self-start mb-4">Categories</div>
                    <div className="w-20 h-20 rounded-full border-6 border-zinc-800 border-t-[#3b82f6] border-r-[#8b5cf6] border-b-[#22c55e]"></div>
                  </div>
                </div>

                {/* TRANSACTIONS */}
                <div className="space-y-3">
                  <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">Recent Transactions</div>
                  <div className="space-y-2">
                    {[
                      { name: "Netflix", category: "SUBSCRIPTIONS", amount: "- $15.99", color: "#8b5cf6" },
                      { name: "Whole Foods", category: "GROCERY", amount: "- $67.42", color: "#22c55e" },
                      { name: "Salary Deposit", category: "SALARY", amount: "+ $2,600.00", color: "#f59e0b" },
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-xs font-bold" style={{ color: t.color }}>
                            {t.name[0]}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold uppercase">{t.name}</div>
                            <div className="text-[9px] text-zinc-500 font-mono uppercase">AI: {t.category}</div>
                          </div>
                        </div>
                        <div className="font-mono text-xs">{t.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* DECORATIVE */}
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-zinc-800 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-zinc-800 -z-10"></div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 space-y-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase text-[#3b82f6] mb-4">Core Features</h2>
            <p className="text-4xl font-bold tracking-tighter">ENGINEERED FOR PRECISION.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI Smart Input", desc: "Type naturally — \"coffee 4.50\" — and AI categorizes it instantly. No forms, no friction.", accent: "#3b82f6" },
              { icon: PieChart, title: "Budget Tracking", desc: "Set monthly limits per category. Visual progress bars show exactly where you stand.", accent: "#22c55e" },
              { icon: BarChart3, title: "Visual Analytics", desc: "Pie charts, bar graphs, and daily spending lines. See patterns you'd never catch in a spreadsheet.", accent: "#8b5cf6" },
            ].map((f, i) => (
              <div key={i} className="bg-[#111111] border border-[#222222] p-8 space-y-6 hover:border-zinc-500 transition-colors">
                <f.icon className="w-7 h-7" style={{ color: f.accent }} strokeWidth={1.5} />
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em]">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
                <div className="h-0.5 w-12" style={{ backgroundColor: f.accent }}></div>
              </div>
            ))}
          </div>
        </section>

        {/* AI CALLOUT */}
        <section id="ai" className="bg-zinc-900/30 py-32 border-t border-[#222222]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-semibold tracking-[0.1em] uppercase border border-[#8b5cf6]/20">
                Intelligence Engine
              </div>
              <h2 className="text-5xl font-bold tracking-tighter leading-tight">
                TALK TO YOUR <br />FINANCIAL DATA.
              </h2>
              <p className="text-zinc-400">
                Type &quot;lunch 12&quot; or &quot;netflix subscription&quot; — AI understands context, categorizes automatically, and tracks recurring charges.
              </p>
              <div className="p-4 border border-zinc-800 bg-black font-mono text-sm">
                <span className="text-zinc-600">$ </span>
                <span className="text-white">Show me subscriptions over $10...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
              {[
                { value: "4", label: "Categories" },
                { value: "<1s", label: "Parse Time" },
                { value: "256-bit", label: "Encryption" },
                { value: "0", label: "Manual Entry" },
              ].map((s, i) => (
                <div key={i} className="bg-black p-8">
                  <div className="text-4xl font-mono font-bold">{s.value}</div>
                  <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32 text-center border-t border-[#222222]">
          <div className="space-y-8">
            <h2 className="text-6xl lg:text-7xl font-bold tracking-tighter uppercase">
              OWN YOUR <span className="text-zinc-700">SPENDING.</span>
            </h2>
            <p className="text-zinc-400 text-xl max-w-xl mx-auto">
              Stop guessing where the money goes. Start tracking in under 60 seconds.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => openSignUp()} className="bg-[#3b82f6] text-white px-12 py-5 font-bold uppercase tracking-[0.15em] hover:bg-[#2563eb] transition-colors">
                Get Started Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#222222] px-6 lg:px-12 py-12 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white flex items-center justify-center text-black font-bold text-xs">E</div>
              <span className="text-sm font-extrabold tracking-[0.2em] uppercase">ExpenseTracker</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              AI-powered expense tracking for individuals who value precision.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-300">Product</div>
            <ul className="space-y-2">
              <li><button onClick={() => openSignIn()} className="text-zinc-500 text-xs uppercase font-bold hover:text-white transition-colors">Sign In</button></li>
              <li><button onClick={() => openSignUp()} className="text-zinc-500 text-xs uppercase font-bold hover:text-white transition-colors">Sign Up</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-300">Legal</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-500 text-xs uppercase font-bold hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-zinc-500 text-xs uppercase font-bold hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-zinc-900 flex justify-between items-center">
          <div className="text-[10px] text-zinc-600 font-mono">© 2026 EXPENSETRACKER</div>
          <div className="text-[10px] text-zinc-600 font-mono">SYSTEM STATUS: OPTIMAL</div>
        </div>
      </footer>
    </div>
  );
}
