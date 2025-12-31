// src/lib/logger.ts
import { prisma } from "@/lib/prisma";

export async function logAdminAction(userId: string, action: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || "No details provided",
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}