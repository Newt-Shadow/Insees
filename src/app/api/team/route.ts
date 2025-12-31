// src/app/api/team/route.ts
import { NextResponse } from "next/server";
import { getTeamData } from "@/lib/team-data";

export async function GET() {
  try {
    const data = await getTeamData();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}