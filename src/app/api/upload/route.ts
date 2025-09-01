import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma";

interface UploadedImage {
  id: number;
  src: string;
  key: string;
  category: string;
}

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9.-]/g, "_");

// --- POST: Upload images ---
export async function POST(req: Request) {
  try {
    const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    if (!BLOB_READ_WRITE_TOKEN)
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN not set" },
        { status: 500 }
      );

    const formData = await req.formData();
    const category = (formData.get("category") as string)?.trim();
    const files = formData.getAll("files") as File[];

    if (!category) return NextResponse.json({ error: "No category provided" }, { status: 400 });
    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages: UploadedImage[] = [];

    // Ensure at least one GalleryConfig exists
    let config = await prisma.galleryConfig.findFirst();
    if (!config) {
      config = await prisma.galleryConfig.create({
        data: { driveLink: "https://example.com/default-drive-folder" },
      });
    }

    for (const file of files) {
      const sanitizedName = sanitizeFileName(file.name);
      const key = `gallery/${Date.now()}-${sanitizedName}`;

      // Upload to Vercel Blob
      const { url } = await put(key, file, {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      });

      const record = await prisma.gallery.create({
        data: { src: url, key, category, galleryConfigId: config.id },
      });

      uploadedImages.push({ id: record.id, src: url, key, category });
    }

    return NextResponse.json({ success: true, uploadedImages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- GET: Fetch images by category ---
// --- GET: Fetch images by category ---
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.trim();

    const images: UploadedImage[] = await prisma.gallery.findMany({
      where: category
        ? { category: { contains: category, mode: "insensitive" } } // 🔥 changed
        : undefined,
      select: { id: true, src: true, key: true, category: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

