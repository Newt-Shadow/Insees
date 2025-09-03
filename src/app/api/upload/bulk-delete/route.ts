import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface BulkDeleteBody {
  items?: { key: string }[];
  category?: string;
}

export async function POST(req: Request) {
  try {
    const body: BulkDeleteBody = await req.json();

    if (body.items && body.items.length > 0) {
      const keys = body.items.map((i) => i.key);
      await cloudinary.api.delete_resources(keys);
      return NextResponse.json({ success: true, deleted: keys.length });
    }

    if (body.category) {
      const folder = `insees/gallery/${body.category}`;
      await cloudinary.api.delete_resources_by_prefix(folder);
      await cloudinary.api.delete_folder(folder);
      return NextResponse.json({ success: true, deletedCategory: body.category });
    }

    return NextResponse.json({ error: "No items or category provided" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
