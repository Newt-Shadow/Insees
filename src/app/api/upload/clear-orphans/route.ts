import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function deleteBlob(key: string, token: string, retries = 3, delay = 1000) {
  const blobApiUrl = `https://blob.vercel-storage.com/${key}`;

  for (let i = 0; i < retries; i++) {
    const res = await fetch(blobApiUrl, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok || res.status === 404) return; // deleted or already gone

    if (i < retries - 1) {
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    const text = await res.text();
    throw new Error(`Blob delete failed: ${res.status} ${text}`);
  }
}

export async function POST() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN not set" },
        { status: 500 }
      );
    }

    // 1. Fetch all DB records
    const dbImages = await prisma.gallery.findMany({
      select: { id: true, key: true },
    });

    // 2. Fetch all blobs from storage (CORRECT ENDPOINT)
    const blobRes = await fetch("https://blob.vercel-storage.com", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!blobRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch blob list" },
        { status: 500 }
      );
    }

    const { blobs } = await blobRes.json();
    const blobKeys = new Set(blobs.map((b: { pathname: string }) => b.pathname));

    const deletedDbIds: number[] = [];
    const deletedBlobKeys: string[] = [];

    // 3a. Remove DB entries whose blob is missing
    await Promise.all(
      dbImages.map(async (img) => {
        if (!blobKeys.has(img.key)) {
          await prisma.gallery.delete({ where: { id: img.id } });
          deletedDbIds.push(img.id);
        }
      })
    );

    // 3b. Remove blobs that don’t exist in DB
    const dbKeys = new Set(dbImages.map((i) => i.key));

    await Promise.all(
      blobs.map(async (blob: { pathname: string }) => {
        if (!dbKeys.has(blob.pathname)) {
          try {
            await deleteBlob(blob.pathname, token);
            deletedBlobKeys.push(blob.pathname);
          } catch (err) {
            console.error(`Failed to delete blob ${blob.pathname}:`, err);
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      deletedDbIds,
      deletedBlobKeys,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
