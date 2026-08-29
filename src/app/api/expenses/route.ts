import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Expense } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    const expenses = await db.collection<Expense>("expenses").find({ userId }).sort({ date: -1 }).toArray();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const expense: Expense = await request.json();
    if (!expense.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("expenses").insertOne(expense);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const expense: Expense = await request.json();
    if (!expense.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("expenses").updateOne(
      { id: expense.id, userId: expense.userId },
      { $set: { ...expense, updatedAt: new Date().toISOString() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
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
    await db.collection("expenses").deleteOne({ id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
