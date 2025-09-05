import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Path to JSON file
const jsonPath = path.join(process.cwd(), "public", "data", "events.json");

export type Event = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  color: "amber" | "green" | "blue" | "orange";   // ✅ narrowed union
  icon: "FaRocket" | "FaGraduationCap" | "FaUsers" | "default"; // ✅ narrowed union
};

/**
 * Read events.json
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
 * Write to events.json
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
    const events = await readFromJson();
    return NextResponse.json(events);
  } catch (err) {
    console.error("❌ GET /events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<Event, "id">[];

    // Load existing events
    const existing = await readFromJson();
    const nextId = existing.length > 0 ? Math.max(...existing.map(e => e.id)) + 1 : 1;

    // Assign IDs & merge
    const newEvents: Event[] = body.map((e, i) => ({
      id: nextId + i,
      ...e,
    }));

    const updatedEvents = [...existing, ...newEvents];

    // Save back to JSON
    await writeToJson(updatedEvents);

    return NextResponse.json(updatedEvents);
  } catch (err) {
    console.error("❌ POST /events error:", err);
    return NextResponse.json({ error: "Failed to save events" }, { status: 500 });
  }
}
