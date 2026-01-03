import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GalleryUpload = {
  src: string;
  publicId: string;
  year: string;
  event: string;
  width?: number | null;
  height?: number | null;
};


// GET (Keep this as is)
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    const years = [...new Set(images.map((img) => img.year))].sort().reverse();
    const events = [...new Set(images.map((img) => img.event))].sort();

    return NextResponse.json({
      images,
      filters: { years, events }
    });
  } catch (err) {
    console.error("Gallery Fetch Error:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// ✅ POST (UPDATED: Receives URLs, does NOT upload files)
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Read JSON, not FormData
    const { uploads } = body; 

    if (!uploads || !Array.isArray(uploads)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Save all to database
    const savedImages = await prisma.$transaction(
      uploads.map((img: GalleryUpload) => 
        prisma.galleryImage.create({
          data: {
            src: img.src,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            year: img.year,
            event: img.event,
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: savedImages });

  } catch (err) {
    console.error("DB Save Error:", err);
    return NextResponse.json({ error: "Database save failed" }, { status: 500 });
  }
}

// DELETE (Keep this as is)
export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json(); 
    const imagesToDelete = await prisma.galleryImage.findMany({
      where: { id: { in: ids } },
    });

    const deletePromises = imagesToDelete.map((img) =>
      cloudinary.uploader.destroy(img.publicId)
    );
    await Promise.all(deletePromises);

    await prisma.galleryImage.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}