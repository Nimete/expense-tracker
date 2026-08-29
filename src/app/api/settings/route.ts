import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    const settings = await db.collection("settings").findOne({ userId });
    return NextResponse.json(settings || { currency: "USD", theme: "light" });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...settings } = body;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("settings").updateOne(
      { userId },
      { $set: settings },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
