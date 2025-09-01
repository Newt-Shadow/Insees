import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface DeleteItem {
  id: number;
  key: string;
}

// Delete blob with retry
async function deleteBlob(key: string, token: string, retries = 3, delay = 1000) {
  // ✅ correct endpoint (no /api/blob/)
  const blobApiUrl = `https://blob.vercel-storage.com/${encodeURIComponent(key)}`;

  for (let i = 0; i < retries; i++) {
    const res = await fetch(blobApiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function POST(req: Request) {
  try {
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    if (!BLOB_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN not set" },
        { status: 500 }
      );
    }

    const body: { items: DeleteItem[] } = await req.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const results = await Promise.all(
      body.items.map(async (item) => {
        try {
          // delete blob first
          await deleteBlob(item.key, BLOB_TOKEN);

          // delete db record
          await prisma.gallery.delete({ where: { id: item.id } });

          return { id: item.id, success: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          return { id: item.id, success: false, error: message };
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
