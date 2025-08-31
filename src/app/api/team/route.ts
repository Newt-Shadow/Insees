// Example for GET /team
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

//  export const runtime = "edge";

interface Member {
  id: number;
  name: string;
  por: string;
  img: string;
  socials: { instagram?: string; facebook?: string; linkedin?: string };
  type: "CORE" | "EXECUTIVE";
}

export async function GET() {
  const years = await prisma.year.findMany({ include: { members: true }, orderBy: { label: "asc" } });

  const teamData: Record<string, { core: Member[]; executive: Member[] }> = {};

  years.forEach((year) => {
    teamData[year.label] = {
      core: year.members.filter((m) => m.type === "CORE") as Member[],
      executive: year.members.filter((m) => m.type === "EXECUTIVE") as Member[],
    };
  });

  return NextResponse.json(teamData);
}
