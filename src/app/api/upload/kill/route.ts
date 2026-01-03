import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAdminAction } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/* 🔧 CLOUDINARY CONFIG                                                 */
/* ------------------------------------------------------------------ */

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ------------------------------------------------------------------ */
/* 🔒 ABSOLUTE WHITELIST (HUMAN IDENTITY)                                */
/* ------------------------------------------------------------------ */

const ALLOWED_COMMANDERS = new Set<string>([
  "anmol.s.sahoo@gmail.com",
  // add more explicitly if needed
]);

/* ------------------------------------------------------------------ */
/* 🔐 TYPES                                                             */
/* ------------------------------------------------------------------ */

type NukeRequestBody = {
  confirm_step_1: string;
  confirm_step_2: string;
  passphrase: string;
  nonce: string;
  issuedAt: number;
};

type CloudinaryDeleteResponse = {
  next_cursor?: string;
};

/* ------------------------------------------------------------------ */
/* ⏱️ SECURITY CONSTANTS                                                 */
/* ------------------------------------------------------------------ */

const REQUIRED_CONFIRM_1 = "I_UNDERSTAND_THIS_ACTION_IS_IRREVERSIBLE";
const REQUIRED_CONFIRM_2 = "EXECUTE_SYSTEM_NUCLEAR_WIPE";

const PASSPHRASE = process.env.NUKE_PASSPHRASE!;
const WINDOW_SECONDS = Number(process.env.NUKE_WINDOW_SECONDS ?? 30);

/* ------------------------------------------------------------------ */
/* 🛡️ HELPERS                                                           */
/* ------------------------------------------------------------------ */

function isWithinWindow(issuedAt: number): boolean {
  const now = Date.now();
  return Math.abs(now - issuedAt) <= WINDOW_SECONDS * 1000;
}

/* ------------------------------------------------------------------ */
/* 💣 DESTRUCTION ROUTINES                                               */
/* ------------------------------------------------------------------ */

async function nukeAllResources() {
  const resourceTypes: Array<"image" | "video" | "raw"> = [
    "image",
    "video",
    "raw",
  ];

  for (const type of resourceTypes) {
    let cursor: string | undefined;

    do {
      const res = (await cloudinary.api.delete_all_resources({
        resource_type: type,
        next_cursor: cursor,
        invalidate: true,
      })) as CloudinaryDeleteResponse;

      cursor = res.next_cursor;
    } while (cursor);
  }
}

async function nukeAllFolders() {
  const { folders } = await cloudinary.api.root_folders();
  for (const folder of folders) {
    await cloudinary.api.delete_folder(folder.name).catch(() => {
      // Ignore virtual / protected folders
    });
  }
}

/* ------------------------------------------------------------------ */
/* ☢️ MAIN ROUTE                                                        */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    /* -------------------------------------------------------------- */
    /* 🔑 AUTHENTICATION                                               */
    /* -------------------------------------------------------------- */

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.email || !ALLOWED_COMMANDERS.has(session.user.email)) {
      await logAdminAction(
        session.user.id,
        "SECURITY_ALERT",
        `Unauthorized commander attempt: ${session.user.email}`
      );
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    /* -------------------------------------------------------------- */
    /* 🔐 PAYLOAD VALIDATION                                           */
    /* -------------------------------------------------------------- */

    const body = (await req.json()) as NukeRequestBody;

    if (
      body.confirm_step_1 !== REQUIRED_CONFIRM_1 ||
      body.confirm_step_2 !== REQUIRED_CONFIRM_2
    ) {
      return NextResponse.json(
        { error: "Double confirmation failed" },
        { status: 400 }
      );
    }

    if (body.passphrase !== PASSPHRASE) {
      await logAdminAction(
        session.user.id,
        "SECURITY_ALERT",
        "Invalid nuclear passphrase attempt"
      );
      return NextResponse.json({ error: "Invalid passphrase" }, { status: 403 });
    }

    if (!isWithinWindow(body.issuedAt)) {
      return NextResponse.json(
        { error: "Request expired" },
        { status: 408 }
      );
    }

    /* -------------------------------------------------------------- */
    /* 📝 AUDIT BEFORE EXECUTION                                       */
    /* -------------------------------------------------------------- */

    await logAdminAction(
      session.user.id,
      "SYSTEM_NUKE",
      `NUCLEAR WIPE INITIATED | nonce=${body.nonce}`
    );

    /* -------------------------------------------------------------- */
    /* 💥 EXECUTION                                                    */
    /* -------------------------------------------------------------- */

    await nukeAllResources();
    await nukeAllFolders();

    /* -------------------------------------------------------------- */
    /* 🧾 AUDIT AFTER EXECUTION                                        */
    /* -------------------------------------------------------------- */

    await logAdminAction(
      session.user.id,
      "SYSTEM_NUKE_COMPLETE",
      "All Cloudinary assets destroyed"
    );

    return NextResponse.json({
      ok: true,
      message: "☢️ System sanitized. All assets destroyed.",
    });
  } catch (error) {
    console.error("NUKE FAILURE:", error);
    return NextResponse.json(
      { error: "Nuclear operation failed" },
      { status: 500 }
    );
  }
}
