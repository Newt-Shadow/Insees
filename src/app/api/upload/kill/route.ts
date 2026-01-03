// src/app/api/upload/kill/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAdminAction } from "@/lib/logger";

// 🔧 CONFIGURATION
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔒 STRICT WHITELIST
// Only these emails can trigger the nuke, even if they are SUPER_ADMIN.
const ALLOWED_COMMANDERS = [
  "anmol.s.sahoo@gmail.com",
  // Add other approved emails here
];

// --- HELPER FUNCTIONS ---

async function nukeAllResources() {
  const resourceTypes = ["image", "video", "raw"];
  for (const type of resourceTypes) {
    let nextCursor: string | undefined = undefined;
    do {
      // @ts-ignore - Cloudinary types can be finicky
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
      await cloudinary.api.delete_folder(folder.name).catch((err) => {
        console.warn(`⚠️ Could not delete folder ${folder.name} (likely virtual or non-empty)`, err);
      });
    }
  } catch (err) {
    console.error("Folder deletion failed:", err);
  }
}

// --- MAIN ROUTE ---

export async function POST(req: Request) {
  try {
    // 🛡️ 1. AUTHENTICATION & ROLE CHECK
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      // 🚨 Log Hacking Attempt
      if (session?.user?.id) {
        await logAdminAction(
            session.user.id, 
            "SECURITY_ALERT", 
            "Insufficient privileges to access KILL switch"
        );
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🛡️ 2. STRICT IDENTITY CHECK (The "Anmol Only" Rule)
    if (!session.user.email || !ALLOWED_COMMANDERS.includes(session.user.email)) {
      // 🚨 Log Insider Threat
      await logAdminAction(
        session.user.id, 
        "SECURITY_ALERT", 
        `Unauthorized Commander: ${session.user.email} tried to NUKE the system.`
      );
      return NextResponse.json(
        { error: "Access Denied: You are not authorized for this destructive command." }, 
        { status: 403 }
      );
    }

    // 🛡️ 3. "ASK TWICE" PROTOCOL (Double Confirmation)
    // The request body MUST contain these two specific strings to proceed.
    const body = await req.json();
    
    const check1 = body.confirm_step_1 === "I_AM_FULLY_AWARE_THIS_IS_PERMANENT";
    const check2 = body.confirm_step_2 === "EXECUTE_NUCLEAR_WIPE";

    if (!check1 || !check2) {
      return NextResponse.json({ 
        error: "Confirmation Failed",
        message: "You must provide double confirmation to proceed.",
        required_fields: {
            confirm_step_1: "I_AM_FULLY_AWARE_THIS_IS_PERMANENT",
            confirm_step_2: "EXECUTE_NUCLEAR_WIPE"
        }
      }, { status: 400 });
    }

    console.log(`💀 NUCLEAR EVENT STARTED BY: ${session.user.email}`);

    // 📝 4. AUDIT LOGGING (Before Execution)
    await logAdminAction(
      session.user.id,
      "SYSTEM_NUKE",
      "⚠️ EXECUTED NUCLEAR WIPE: All assets are being deleted."
    );

    // 💣 5. EXECUTE WIPE
    await nukeAllResources();
    await nukeAllFolders();

    console.log("✅ Nuclear wipe complete.");

    return NextResponse.json({ 
      ok: true, 
      message: "System Sanitized. All Cloudinary assets have been destroyed." 
    });

  } catch (error) {
    console.error("Nuke failed:", error);
    return NextResponse.json({ error: "Operation failed due to server error" }, { status: 500 });
  }
}