// src/app/api/admin/heartbeat/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  // 1. Lightweight Check
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Fast Update
    // We update ONLY the timestamp. This is very cheap for the DB.
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastActive: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // If it fails, we don't crash the app, we just ignore it.
    console.error("Heartbeat failed:", error); 
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}