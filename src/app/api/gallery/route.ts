import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

function normalizeCategory(name: string) {
  return name
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // 🔹 Specific category
    if (category && category.toLowerCase() !== "all") {
      const normalized = normalizeCategory(category);

      const response = await cloudinary.api.resources({
        type: "upload",
        prefix: `insees/gallery/${category}`,
        max_results: 200,
      });

      const resources = (response?.resources || []) as CloudinaryResource[];

      const images = resources.map((img) => ({
        src: img.secure_url,
        category: normalized,
      }));

      return NextResponse.json({
        categories: images.length > 0 ? [normalized] : [],
        images,
      });
    }

    // 🔹 All folders
    const folderRes = await cloudinary.api.sub_folders("insees/gallery");
    const folders = (folderRes?.folders || []) as CloudinaryFolder[];

    if (!folders.length) {
      return NextResponse.json({ categories: [], images: [] });
    }

    const categories = folders.map((f) => normalizeCategory(f.name));

    const results = await Promise.all(
      folders.map(async (folder) => {
        const response = await cloudinary.api.resources({
          type: "upload",
          prefix: `insees/gallery/${folder.name}`,
          max_results: 200,
        });

        const resources = (response?.resources || []) as CloudinaryResource[];

        return resources.map((img) => ({
          src: img.secure_url,
          category: normalizeCategory(folder.name),
        }));
      })
    );

    const allImages = results.flat();

    return NextResponse.json({
      categories: allImages.length ? categories : [],
      images: allImages,
    });
  } catch (err) {
    console.error("❌ Gallery API error:", err);
    return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
