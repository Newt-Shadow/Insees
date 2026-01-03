import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAdminAction } from "@/lib/logger";

// Helper for Session Check
async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}

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
// POST a new event
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();

    const eventData = {
      title: body.title,
      description: body.description,
      fullDescription: body.fullDescription,
      category: body.category ?? "Technical",

      // ✅ STRING — EXACTLY AS SCHEMA EXPECTS
      date: body.date ? String(body.date) : null,
      registrationOpen: body.registrationOpen
        ? String(body.registrationOpen)
        : null,

      year: body.year,
      status: body.status ?? "upcoming",
      location: body.location,
      sponsor: body.sponsor,
      registrationLink: body.registrationLink,
      image: body.image,
      registrationEnabled: body.registrationEnabled ?? true,
    };

    const newEvent = await prisma.event.create({ data: eventData });
    await logAdminAction(session.user.id, "CREATE_EVENT", `Created event: ${body.title}`);
    return NextResponse.json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}


// DELETE an event
export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.event.delete({ where: { id: id } }); // Assuming ID is string CUID now
    const event = await prisma.event.delete({ where: { id } });

    // ✅ LOG ACTION
    await logAdminAction(session.user.id, "DELETE_EVENT", `Deleted event: ${event.title}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting event:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

// PATCH update event
export async function PATCH(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { id, ...data } = body;

    if (data.date) data.date = String(data.date);
    if (data.registrationOpen) data.registrationOpen = String(data.registrationOpen);

    const updated = await prisma.event.update({
      where: { id },
      data,
    });
    await logAdminAction(session.user.id, "UPDATE_EVENT", `Updated event: ${updated.title}`);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating event:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
