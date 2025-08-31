import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
