import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // ✅ Prisma requires Node.js

// Path to JSON fallback
const jsonPath = path.join(process.cwd(), "public", "data", "events.json");

// Type matches Prisma schema
export type Event = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  color: string; // not strict union, since stored as plain string
  icon: string;  // same
};

/**
 * Read events.json from /public
 */
async function readFromJson(): Promise<Event[]> {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(raw) as Event[];
  } catch (err) {
    console.error("❌ Error reading events.json:", err);
    return [];
  }
}

/**
 * Write updated events to events.json
 */
async function writeToJson(data: Event[]) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Error writing events.json:", err);
  }
}

export async function GET() {
  try {
    // ✅ Always serve from JSON first (fast)
    const fileData = await readFromJson();

    // Fire Prisma in background (non-blocking) to sync latest
    (async () => {
      try {
        const dbEvents = await prisma.event.findMany();
        if (dbEvents.length > 0) {
          await writeToJson(dbEvents); // keep JSON fresh
        }
      } catch (err) {
        console.warn("⚠️ Prisma fallback failed:", err);
      }
    })();

    return NextResponse.json(fileData);
  } catch (err) {
    console.error("❌ GET /events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<Event, "id">[]; // id auto from DB

    // ✅ Insert into DB
    const created = await prisma.event.createMany({
      data: body,
      skipDuplicates: true,
    });

    // ✅ Fetch updated list
    const updatedEvents = await prisma.event.findMany();

    // ✅ Sync JSON
    await writeToJson(updatedEvents);

    return NextResponse.json(updatedEvents);
  } catch (err) {
    console.error("❌ POST /events error:", err);
    return NextResponse.json({ error: "Failed to save events" }, { status: 500 });
  }
}
