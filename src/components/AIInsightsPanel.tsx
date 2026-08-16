"use client";

import { useState } from "react";
import { Expense } from "@/lib/types";
import { getInsights } from "@/lib/ai";

interface AIInsightsPanelProps {
  expenses: Expense[];
  currency: string;
}

interface Insights {
  topCategories: { category: string; amount: number }[];
  anomalies: string[];
  tip: string;
  healthScore: number;
  healthExplanation: string;
}

export default function AIInsightsPanel({ expenses, currency }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (expenses.length === 0) {
      setError("Add some expenses first to get insights.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await getInsights(expenses, currency);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sharp-card p-6 accent-purple">
      <div className="flex justify-between items-center mb-6">
        <h2 className="stat-label">AI Insights</h2>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#22c55e] hover:text-[#4ade80] disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing..." : insights ? "Refresh" : "Get Insights"}
        </button>
      </div>

      {error && (
        <p className="text-[10px] text-[#ef4444] font-mono mb-4">{error}</p>
      )}

      {insights && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="stat-label">Health Score</span>
            <span className={`text-[10px] font-bold font-mono ${
              insights.healthScore >= 7 ? "text-[#22c55e]" :
              insights.healthScore >= 4 ? "text-[#f59e0b]" : "text-[#ef4444]"
            }`}>
              {insights.healthScore}/10
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-400">
            {insights.healthExplanation}
          </p>

          {insights.topCategories.length > 0 && (
            <div className="space-y-2">
              {insights.topCategories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase">{cat.category}</span>
                  <span className="text-[10px] font-mono">{currency} {cat.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {insights.anomalies.length > 0 && (
            <div className="space-y-1">
              {insights.anomalies.map((a, i) => (
                <p key={i} className="text-[10px] text-zinc-500">{a}</p>
              ))}
            </div>
          )}

          {insights.tip && (
            <div className="p-3 bg-[#18181b] border border-[#222222] text-[10px] font-mono leading-tight text-zinc-300 uppercase tracking-tight">
              TIP: {insights.tip}
            </div>
          )}
        </div>
      )}

      {!insights && !loading && !error && (
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center py-4">
          Click refresh for AI insights
        </p>
      )}
    </section>
  );
}
