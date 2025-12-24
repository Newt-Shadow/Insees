import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import fs from "fs";
import path from "path";

interface Member {
  id?: number;
  name: string;
  por: string;
  img: string;
  socials: { instagram?: string; facebook?: string; linkedin?: string };
  type: "CORE" | "EXECUTIVE";
}

type TeamData = Record<string, { core: Member[]; executive: Member[] }>;

function loadTeamJson(): TeamData {
  const filePath = path.join(process.cwd(), "public/data/team.json");
  const file = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(file);
}

async function syncDbWithJson(teamJson: TeamData) {
  for (const [yearLabel, { core, executive }] of Object.entries(teamJson)) {
    let year = await prisma.year.findUnique({ where: { label: yearLabel } });

    if (!year) {
      year = await prisma.year.create({ data: { label: yearLabel } });
    }

    const membersFromJson: Member[] = [
      ...core.map((m) => ({ ...m, type: "CORE" as const })),
      ...executive.map((m) => ({ ...m, type: "EXECUTIVE" as const })),
    ];

    for (const member of membersFromJson) {
      const existing = await prisma.member.findFirst({
        where: { name: member.name, yearId: year.id },
      });

      if (!existing) {
        await prisma.member.create({
          data: {
            name: member.name,
            por: member.por,
            img: member.img,
            socials: member.socials,
            type: member.type,
            yearId: year.id,
          },
        });
      } else {
        await prisma.member.update({
          where: { id: existing.id },
          data: {
            por: member.por,
            img: member.img,
            socials: member.socials,
            type: member.type,
          },
        });
      }
    }
  }
}

export async function GET() {
  const teamJson = loadTeamJson();
   console.log(teamJson);


  // return response immediately
  const response = NextResponse.json(teamJson);

  // trigger DB sync in background (non-blocking)
  syncDbWithJson(teamJson).catch((err) =>
    console.error("DB sync failed:", err)
  );

  return response;
}
