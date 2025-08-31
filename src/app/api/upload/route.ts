// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma";

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// Sanitize file name
const sanitizeFileName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
};

// POST: Upload images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    let category = (formData.get("category") as string)?.trim();
    const files = formData.getAll("files") as File[];

    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages: { id: number; src: string; key: string; category: string }[] = [];

    for (const file of files) {
      const sanitizedName = sanitizeFileName(file.name);
      const key = `gallery/${Date.now()}-${sanitizedName}`;
      console.log("Uploading file:", file.name, "with key:", key); // Debug log
      const { url } = await put(key, file, { access: "public", token: BLOB_READ_WRITE_TOKEN });
      console.log("Uploaded blob:", { key, url }); // Debug log

      const record = await prisma.gallery.create({
        data: { src: url, key, category, galleryConfigId: 1 },
      });

      uploadedImages.push({ id: record.id, src: url, key, category });
    }

    return NextResponse.json({ success: true, uploadedImages });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch images by category
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const images = await prisma.gallery.findMany({
      where: category ? { category: { equals: category.trim(), mode: "insensitive" } } : undefined,
      select: { id: true, src: true, key: true, category: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("Fetch images error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}