// /app/api/upload/nuke/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function nukeAllResources() {
  const resourceTypes = ["image", "video", "raw"];

  for (const type of resourceTypes) {
    let nextCursor: string | undefined = undefined;

    do {
      const res = await cloudinary.api.delete_all_resources({
        resource_type: type,
        next_cursor: nextCursor,
        invalidate: true,
      });

      console.log(`🗑 Deleted ${type} batch`, res);
      nextCursor = res.next_cursor;
    } while (nextCursor);
  }
}

async function nukeAllFolders() {
  try {
    const { folders } = await cloudinary.api.root_folders();
    for (const folder of folders) {
      console.log(`📂 Deleting folder: ${folder.name}`);
      await cloudinary.api.delete_folder(folder.name).catch(() => {
        console.warn(`⚠️ Could not delete folder ${folder.name} (likely virtual)`);
      });
    }
  } catch (err) {
    console.error("Folder deletion failed:", err);
  }
}

export async function POST() {
  console.log("💀 Nuclear kill switch triggered: wiping ENTIRE Cloudinary account ...");

  await nukeAllResources();
  await nukeAllFolders();

  console.log("✅ Nuclear wipe complete. All assets and folders deleted.");

  return NextResponse.json({ ok: true, message: "Account wiped completely" });
}
