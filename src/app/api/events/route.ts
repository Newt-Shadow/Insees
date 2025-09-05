import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // ✅ Prisma needs Node runtime

const jsonPath = path.join(process.cwd(), "public", "data", "events.json");

// --- Helper: Read from JSON ---
async function readFromJson() {
  try {
    const file = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(file);
  } catch (err) {
    console.error("Failed to read events.json:", err);
    return null;
  }
}

// --- Helper: Write to JSON ---
async function writeToJson(data: any) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write events.json:", err);
  }
}

// --- GET: Prefer JSON, fallback to Prisma ---
export async function GET() {
  try {
    const jsonData = await readFromJson();
    if (jsonData && Array.isArray(jsonData)) {
      return NextResponse.json(jsonData);
    }

    // fallback: fetch from prisma
    const dbEvents = await prisma.event.findMany();
    return NextResponse.json(dbEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// --- POST: Update JSON + Prisma ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // ✅ Update JSON first (fast + source of truth)
    await writeToJson(body);

    // ✅ Sync to Prisma (non-blocking but awaited to ensure consistency)
    await prisma.$transaction(
      body.map((event: any) =>
        prisma.event.upsert({
          where: { id: event.id },
          update: event,
          create: event,
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating events:", err);
    return NextResponse.json({ error: "Failed to update events" }, { status: 500 });
  }
}
