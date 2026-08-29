import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Budget } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    const filter: Record<string, string> = { userId };
    if (month) filter.month = month;
    const budgets = await db.collection<Budget>("budgets").find(filter).toArray();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const budget: Budget = await request.json();
    if (!budget.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("budgets").updateOne(
      { id: budget.id, userId: budget.userId },
      { $set: budget },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/budgets error:", error);
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    if (!id || !userId) {
      return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("budgets").deleteOne({ id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/budgets error:", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
