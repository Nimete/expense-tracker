import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
  }

  const { action, data } = await request.json();

  if (action === "parse-expense") {
    const { text, today } = data;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are an expense parser. Parse expense text into JSON. Today's date is ${today}.

Return ONLY valid JSON with these fields:
- name: string (the item/description)
- amount: number (numeric value only)
- date: string (ISO date YYYY-MM-DD)
- category: one of "finances", "subscriptions", "grocery", "salary"
- isRecurring: boolean (true if looks like a subscription/recurring charge)

No markdown, no explanation, just the JSON object.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Groq API error: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({ result: parsed });
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: content }, { status: 422 });
    }
  }

  if (action === "insights") {
    const { expenses, currency } = data;

    const categoryTotals = expenses.reduce((acc: Record<string, number>, e: { amount: number; category: string }) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const totalExpenses = expenses
      .filter((e: { category: string }) => e.category !== "salary")
      .reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    const totalIncome = expenses
      .filter((e: { category: string }) => e.category === "salary")
      .reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    const recentTransactions = expenses
      .slice(0, 10)
      .map((e: { name: string; amount: number; category: string }) => `${e.name}: ${currency} ${e.amount.toFixed(2)} (${e.category})`)
      .join("\n");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are a financial advisor AI. Analyze spending data and provide concise, actionable insights.

Respond in this exact JSON format:
{
  "topCategories": [{"category": "name", "amount": number}],
  "anomalies": ["string"],
  "tip": "string",
  "healthScore": number (1-10),
  "healthExplanation": "string"
}

No markdown, just JSON.`,
          },
          {
            role: "user",
            content: `Monthly spending data:
Total income: ${currency} ${totalIncome.toFixed(2)}
Total expenses: ${currency} ${totalExpenses.toFixed(2)}
Category breakdown: ${JSON.stringify(categoryTotals)}
Recent transactions:
${recentTransactions}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Groq API error: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({ result: parsed });
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: content }, { status: 422 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
