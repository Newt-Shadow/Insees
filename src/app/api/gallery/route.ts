import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

function normalizeCategory(name: string) {
  return name
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (category && category.toLowerCase() !== "all") {
      const normalized = normalizeCategory(category);

      const { resources } = await cloudinary.api.resources({
        type: "upload",
        prefix: `insees/gallery/${category}`,
        max_results: 200,
      });

      const images = resources.map((img: any) => ({
        src: img.secure_url,
        category: normalized,
      }));

      return NextResponse.json({ categories: [normalized], images });
    }

    // fetch all folders
    const { folders } = await cloudinary.api.sub_folders("insees/gallery");

    const categories: string[] = folders.map((f: { name: string }) =>
      normalizeCategory(f.name)
    );

    const results = await Promise.all(
      folders.map(async (folder: { name: string }) => {
        const normalized = normalizeCategory(folder.name);

        const { resources } = await cloudinary.api.resources({
          type: "upload",
          prefix: `insees/gallery/${folder.name}`,
          max_results: 200,
        });

        return resources.map((img: any) => ({
          src: img.secure_url,
          category: normalized,
        }));
      })
    );

    const allImages = results.flat();

    return NextResponse.json({ categories, images: allImages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Gallery API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
