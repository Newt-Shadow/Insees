import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Debug config
console.log("Loaded Cloudinary config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ set" : "❌ missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Step 1: Undo accidental Unsorted moves ---
async function undoUnsorted() {
  const { resources } = await cloudinary.search
    .expression("folder:insees/gallery/Unsorted/*")
    .max_results(100)
    .execute();

  for (const res of resources) {
    const filename = res.public_id.split("/").pop(); // e.g. IMG-20250516-WA0058_c4wube
    const originalId = filename; // move back to root
    try {
      await cloudinary.uploader.rename(res.public_id, originalId, { overwrite: false });
      console.log(`↩️ Restored: ${res.public_id} → ${originalId}`);
    } catch (err) {
      console.error(`❌ Failed to restore ${res.public_id}:`, err.message);
    }
  }
}

// --- Step 2: Detect proper category and move ---
function detectCategory(publicId) {
  const name = publicId.toLowerCase();

  if (name.includes("farewell")) return "Farewell";
  if (name.includes("orientation")) return "Orientation";
  if (name.includes("freshers")) return "Freshers";

  // add more rules here based on your filenames / tags
  return "Unsorted";
}

async function moveToGalleryFolder(publicId) {
  if (publicId.startsWith("insees/gallery")) {
    console.log(`✅ Already correct: ${publicId}`);
    return;
  }

  const baseName = publicId.split("/").pop();
  const category = detectCategory(publicId);
  const newPublicId = `insees/gallery/${category}/${baseName}`;

  try {
    await cloudinary.uploader.rename(publicId, newPublicId, { overwrite: false });
    console.log(`📦 Moved: ${publicId} → ${newPublicId}`);
  } catch (err) {
    console.error(`❌ Failed to move ${publicId}:`, err.message);
  }
}

async function fixGallery() {
  // First undo previous "Unsorted" moves
  console.log("🔄 Undoing bad Unsorted moves...");
  await undoUnsorted();

  // Now process everything from root
  console.log("📂 Re-categorizing properly...");
  const { resources } = await cloudinary.search
    .expression("resource_type:image")
    .max_results(100)
    .execute();

  for (const res of resources) {
    await moveToGalleryFolder(res.public_id);
  }
}

fixGallery().catch(console.error);
