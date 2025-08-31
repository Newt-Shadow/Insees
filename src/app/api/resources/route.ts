import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

 export const runtime = "edge";

export async function GET() {
  const semesters = await prisma.semester.findMany({
    include: {
      subjects: {
        include: { files: true },
      },
    },
  });

  // Shape: semester → subjects → { name, driveLink, files[] }
  const formatted = semesters.map((sem) => ({
    title: sem.title,
    subjects: sem.subjects.map((sub) => ({
      name: sub.name,
      driveLink: sub.driveLink,
      files: sub.files.map((f) => ({
        name: f.name,
        url: f.url,
      })),
    })),
  }));

  return NextResponse.json({ semesters: formatted });
}
