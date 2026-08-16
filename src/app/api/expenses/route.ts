import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Expense } from "@/lib/types";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const expenses = await db.collection<Expense>("expenses").find().sort({ date: -1 }).toArray();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const expense: Expense = await request.json();
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
    const db = await connectToDatabase();
    await db.collection("expenses").updateOne(
      { id: expense.id },
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
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("expenses").deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/expenses error:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
