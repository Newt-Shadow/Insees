import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface DeleteItem {
  id: number;
  url: string;
}

// --- Delete a single blob with retry ---
async function deleteBlob(url: string, token: string, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) return;
      const text = await res.text();

      if (res.status === 404 && i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw new Error(`Failed to delete blob "${url}": ${res.status} ${text}`);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

// --- POST: Bulk delete ---
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
          await deleteBlob(item.url, BLOB_TOKEN);
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
