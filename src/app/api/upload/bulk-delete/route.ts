// app/api/upload/bulk-delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!BLOB_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN not set");

// Delete a single blob with retry logic
async function deleteBlob(url: string, retries = 3, delay = 1000) {
  console.log("Deleting blob with url:", url); // Debug log

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${BLOB_TOKEN}` },
      });
      if (res.ok) {
        console.log(`Successfully deleted blob at "${url}"`);
        return;
      }
      const text = await res.text();
      if (res.status === 404 && i < retries - 1) {
        console.warn(`Blob not found, retrying (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`Failed to delete blob "${url}": ${res.status} ${text}`);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

// Bulk delete API
export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "No items provided" }, { status: 400 });

    const results = [];
    for (const item of items) {
      try {
        await deleteBlob(item.url);
        await prisma.gallery.delete({ where: { id: item.id } });
        results.push({ id: item.id, success: true });
      } catch (err: any) {
        console.warn("Failed to delete blob (continuing):", err.message);
        results.push({ id: item.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}