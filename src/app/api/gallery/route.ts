import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


// 🔹 Define a type for the cached response
interface GalleryResponse {
  categories: string[];
  images: { src: string; category: string }[];
}

// 🔹 Simple in-memory cache
let cache: {
  data: GalleryResponse;
  timestamp: number;
} | null = null;

const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

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
  [key: string]: unknown;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // ✅ Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

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

      const payload: GalleryResponse = {
        categories: images.length > 0 ? [normalized] : [],
        images,
      };

      cache = { data: payload, timestamp: Date.now() };
      return NextResponse.json(payload);
    }

    // 🔹 All folders
    const folderRes = await cloudinary.api.sub_folders("insees/gallery");
    const folders = (folderRes?.folders || []) as CloudinaryFolder[];

    if (!folders.length) {
      const payload: GalleryResponse = { categories: [], images: [] };
      cache = { data: payload, timestamp: Date.now() };
      return NextResponse.json(payload);
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

    const payload: GalleryResponse = {
      categories: allImages.length ? categories : [],
      images: allImages,
    };

    cache = { data: payload, timestamp: Date.now() };
    return NextResponse.json(payload);
  } catch (err: unknown) {
    console.error("❌ Gallery API error:", err);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
