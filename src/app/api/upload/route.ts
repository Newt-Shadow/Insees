import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma";

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN not set");

interface UploadedImage {
  id: number;
  src: string;
  key: string;
  category: string;
}

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9.-]/g, "_");

// --- POST: Upload images ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const category = (formData.get("category") as string)?.trim();
    const files = formData.getAll("files") as File[];

    if (!category) return NextResponse.json({ error: "No category provided" }, { status: 400 });
    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages: UploadedImage[] = [];

    for (const file of files) {
      const sanitizedName = sanitizeFileName(file.name);
      const key = `gallery/${Date.now()}-${sanitizedName}`;

      const { url } = await put(key, file, { access: "public", token: BLOB_READ_WRITE_TOKEN });
      const record = await prisma.gallery.create({
        data: { src: url, key, category, galleryConfigId: 1 },
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
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.trim() || undefined;

    const images: UploadedImage[] = await prisma.gallery.findMany({
      where: category ? { category: { equals: category, mode: "insensitive" } } : undefined,
      select: { id: true, src: true, key: true, category: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
