import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// --- Types ---
interface UploadedImage {
  id: string;
  src: string;
  key: string;
  category: string;
}

// --- Helper: upload buffer ---
function uploadBuffer(buffer: Buffer, category: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: `insees/gallery/${category}`, resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result);
      }
    );
    upload.end(buffer);
  });
}

// --- POST: Upload images ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const category = (formData.get("category") as string)?.trim();
    const files = formData.getAll("files") as File[];

    if (!category) {
      return NextResponse.json({ error: "No category provided" }, { status: 400 });
    }
    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedImages: UploadedImage[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const res = await uploadBuffer(buffer, category);

      uploadedImages.push({
        id: res.public_id,
        src: res.secure_url,
        key: res.public_id,
        category,
      });
    }

    return NextResponse.json({ success: true, uploadedImages });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// --- GET: Fetch images by category ---
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category")?.trim();

    if (!category) {
      return NextResponse.json({ images: [] });
    }

    const { resources } = await cloudinary.search
      .expression(`folder:insees/gallery/${category}`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();

    const images: UploadedImage[] = (resources as UploadApiResponse[]).map((r, idx) => ({
      id: String(idx + 1), // frontend still gets unique id
      src: r.secure_url,
      key: r.public_id,
      category,
    }));

    return NextResponse.json({ images });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
