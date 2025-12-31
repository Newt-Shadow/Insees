import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST a new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventData = {
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
      registrationOpen: body.registrationOpen ? new Date(body.registrationOpen) : null,
    };
    const newEvent = await prisma.event.create({ data: eventData });
    return NextResponse.json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

// DELETE an event
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.event.delete({ where: { id: id } }); // Assuming ID is string CUID now
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting event:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

// PATCH update event
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const updated = await prisma.event.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    // Removed unused 'err' variable
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}