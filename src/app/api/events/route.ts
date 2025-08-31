import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge"; // important!

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
