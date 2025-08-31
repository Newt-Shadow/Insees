import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const years = await prisma.year.findMany({
    include: { members: true },
    orderBy: { label: "asc" },
  });

  // Shape: { "2024-25": { core: [], executive: [] } }
  const teamData: Record<string, { core: any[]; executive: any[] }> = {};

  years.forEach((year) => {
    teamData[year.label] = {
      core: year.members.filter((m) => m.type === "CORE"),
      executive: year.members.filter((m) => m.type === "EXECUTIVE"),
    };
  });

  return NextResponse.json(teamData);
}
