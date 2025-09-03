import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// --- POST: Upload images ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const category = (formData.get("category") as string)?.trim();
    const files = formData.getAll("files") as File[];

    if (!category) return NextResponse.json({ error: "No category provided" }, { status: 400 });
    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages: { id: string; src: string; key: string; category: string }[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // upload to Cloudinary inside category folder
      const result = await cloudinary.uploader.upload_stream({
        folder: `insees/gallery/${category}`,
        resource_type: "image",
      });

      // manually pipe buffer into upload_stream
      await new Promise<void>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: `insees/gallery/${category}`, resource_type: "image" },
          (err, res) => {
            if (err || !res) return reject(err);
            uploadedImages.push({
              id: res.public_id,
              src: res.secure_url,
              key: res.public_id,
              category,
            });
            resolve();
          }
        );
        upload.end(buffer);
      });
    }

    return NextResponse.json({ success: true, uploadedImages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- GET: Fetch images by category ---
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.trim();

    if (!category)
      return NextResponse.json({ images: [] });

    const { resources } = await cloudinary.search
      .expression(`folder:insees/gallery/${category}`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();

    const images = resources.map((r: any, idx: number) => ({
      id: idx + 1, // frontend needs numeric id
      src: r.secure_url,
      key: r.public_id,
      category,
    }));

    return NextResponse.json({ images });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
