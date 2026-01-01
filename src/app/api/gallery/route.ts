import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs"; // Required for Cloudinary upload
export const dynamic = "force-dynamic";

// GET: Fetch Images + Filter Options
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Extract unique Years and Events dynamically from the data
    // This ensures if you add a new year in Admin, it appears here automatically.
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

// POST: Upload Images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const year = formData.get("year") as string;
    const event = formData.get("event") as string;

    if (!files.length || !year || !event) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `insees/gallery/${year}/${event}`, // Organize in Cloudinary too
            resource_type: "image",
          },
          async (error, result) => {
            if (error) return reject(error);
            
            // Save to DB
            if (result) {
              const savedImage = await prisma.galleryImage.create({
                data: {
                  src: result.secure_url,
                  publicId: result.public_id,
                  width: result.width,
                  height: result.height,
                  year,
                  event,
                },
              });
              resolve(savedImage);
            }
          }
        ).end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    return NextResponse.json({ success: true, data: results });

  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// DELETE: Bulk Delete
export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json(); // Array of DB IDs
    
    // 1. Get publicIds from DB to delete from Cloudinary
    const imagesToDelete = await prisma.galleryImage.findMany({
      where: { id: { in: ids } },
    });

    // 2. Delete from Cloudinary
    const deletePromises = imagesToDelete.map((img) => 
      cloudinary.uploader.destroy(img.publicId)
    );
    await Promise.all(deletePromises);

    // 3. Delete from DB
    await prisma.galleryImage.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}