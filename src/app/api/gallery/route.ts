import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const galleryConfig = await prisma.galleryConfig.findFirst({
    include: { images: true },
  });

  if (!galleryConfig) {
    return NextResponse.json({ error: "No gallery found" }, { status: 404 });
  }

  return NextResponse.json({
    driveLink: galleryConfig.driveLink,
    images: galleryConfig.images.map((img) => ({
      id: img.id,
      src: img.src,
      category: img.category,
    })),
  });
}
