import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
};

type CloudinaryFolder = {
    name: string;
};


export async function POST() {
    try {
        const LEGACY_YEAR = "Legacy";
        const BATCH_SIZE = 1000; // Safety limit for bulk inserts

        console.log("🔄 Starting Sync...");

        // 1. Fetch all existing publicIds from DB (Super fast lookup)
        const existingRecords = await prisma.galleryImage.findMany({
            select: { publicId: true },
        });
        const existingSet = new Set(existingRecords.map((r) => r.publicId));
        console.log(`✅ Found ${existingSet.size} existing images in DB.`);

        const imagesToInsert: {
            src: string;
            publicId: string;
            width: number;
            height: number;
            event: string;
            year: string;
        }[] = [];


        // 2. Fetch Subfolders
        const folderRes = await cloudinary.api.sub_folders("insees/gallery");
        const folders: CloudinaryFolder[] = folderRes?.folders ?? [];


        // 3. Process Folders
        for (const folder of folders) {
            const eventName = folder.name
                .trim()
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

            // Fetch up to 500 images per folder
            const response = await cloudinary.api.resources({
                type: "upload",
                prefix: `insees/gallery/${folder.name}`,
                max_results: 500,
            });

            const resources: CloudinaryResource[] = response?.resources ?? [];

            for (const img of resources) {

                // ONLY add if it doesn't exist in DB
                if (!existingSet.has(img.public_id)) {
                    imagesToInsert.push({
                        src: img.secure_url,
                        publicId: img.public_id,
                        width: img.width,
                        height: img.height,
                        event: eventName,
                        year: LEGACY_YEAR,
                    });
                }
            }
        }

        // 4. Process Root Images (Optional)
        const rootRes = await cloudinary.api.resources({
            type: "upload",
            prefix: "insees/gallery",
            max_results: 100,
        });

        // Filter root images (exclude ones that are actually in subfolders)
        const rootResources: CloudinaryResource[] =
            (rootRes?.resources ?? []).filter(
                (img: CloudinaryResource) =>
                    img.public_id.split("/").length === 3 &&
                    !existingSet.has(img.public_id)
            );



        for (const img of rootResources) {
            imagesToInsert.push({
                src: img.secure_url,
                publicId: img.public_id,
                width: img.width,
                height: img.height,
                event: "General",
                year: LEGACY_YEAR,
            });
        }

        // 5. BULK INSERT (The Speed Fix)
        if (imagesToInsert.length > 0) {
            console.log(`🚀 Inserting ${imagesToInsert.length} new images...`);

            // Split into chunks if too huge
            for (let i = 0; i < imagesToInsert.length; i += BATCH_SIZE) {
                const batch = imagesToInsert.slice(i, i + BATCH_SIZE);
                await prisma.galleryImage.createMany({
                    data: batch,
                    skipDuplicates: true,
                });
            }
        }

        return NextResponse.json({ success: true, count: imagesToInsert.length });
    } catch (err) {
        console.error("❌ Sync Error:", err);
        return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
    }
}