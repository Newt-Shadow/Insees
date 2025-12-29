import { cloudinary } from "@/lib/cloudinary";

// Helper to clean up category names
function normalizeCategory(name: string) {
  return name.trim().replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function fetchGalleryData() {
  try {
    // 1. Get all folders from Cloudinary
    const folderRes = await cloudinary.api.sub_folders("insees/gallery");
    const folders = (folderRes?.folders || []) as { name: string }[];

    if (!folders.length) return { categories: [], images: [] };

    const categories = folders.map((f) => normalizeCategory(f.name));

    // 2. Get images from all folders
    const results = await Promise.all(
      folders.map(async (folder) => {
        const response = await cloudinary.api.resources({
          type: "upload",
          prefix: `insees/gallery/${folder.name}`,
          max_results: 50, // Limit per category to be safe
        });
        
        const resources = (response?.resources || []) as { secure_url: string }[];
        
        return resources.map((img) => ({
          src: img.secure_url,
          category: normalizeCategory(folder.name),
        }));
      })
    );

    // 3. Flatten into one list
    const allImages = results.flat().map((img, i) => ({
      id: i,
      src: img.src,
      category: img.category,
    }));

    return { categories, images: allImages };

  } catch (error) {
    console.error("❌ Gallery Service Error:", error);
    return { categories: [], images: [] };
  }
}