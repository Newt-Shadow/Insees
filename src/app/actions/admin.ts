"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod"; // Recommended for validation

const DeveloperSchema = z.object({
  name: z.string().min(2, "Name too short"),
  role: z.string().min(2, "Role required"),
  github: z.string().url().optional().or(z.literal("")),
  image: z.string().optional(),
});
// Helper for Logging

async function checkAuth(requiredRole: "ADMIN" | "SUPER_ADMIN" = "ADMIN") {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: No session found");
  }
  const userRole = session.user.role;
  if (userRole !== "SUPER_ADMIN" && userRole !== requiredRole) {
    throw new Error(`Forbidden: Requires ${requiredRole} access`);
  }

  return session;
}


async function logAction(action: string, details: string) {
  const session = await getServerSession(authOptions);
  if (session?.user) {


    await prisma.auditLog.create({ data: { action, details, userId: session.user.id } });
  }
}

// --- DEVELOPERS ---
export async function addDev(formData: FormData) {

  await checkAuth("ADMIN");

  const rawData = {
    name: formData.get("name"),
    role: formData.get("role"),
    github: formData.get("github"),
    image: formData.get("image"),
  };

  const result = DeveloperSchema.safeParse(rawData);

  if (!result.success) {
    // Return errors to client (you might need to update how you call this action)
    console.error(result.error.flatten()); 
    throw new Error("Invalid form data");
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!name || !role) throw new Error("Name and Role are required");

  await prisma.developer.create({ data: result.data });
  revalidatePath("/admin/developers");
}

export async function deleteDev(formData: FormData) {

  await checkAuth("ADMIN");


  await prisma.developer.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/developers");
}

// --- USERS (SUPER ADMIN) ---
export async function updateUserRole(formData: FormData) {
  const session = await checkAuth("SUPER_ADMIN");

  const role = formData.get("role") as "USER" | "ADMIN" | "SUPER_ADMIN";
  const userId = formData.get("userId") as string;
  await prisma.user.update({ where: { id: userId }, data: { role } });
  await logAction("UPDATE_ROLE", `Changed user ${userId} to ${role}`);
  
  revalidatePath("/admin/users");
}

// --- RESOURCES ---
export async function addSemester(formData: FormData) {
  await prisma.semester.create({ data: { title: formData.get("title") as string } });
  revalidatePath("/admin/resources");
}

export async function addSubject(formData: FormData) {
  await prisma.subject.create({
    data: {
      name: formData.get("name") as string,
      driveLink: formData.get("driveLink") as string,
      semesterId: formData.get("semesterId") as string,
    }
  });
  revalidatePath("/admin/resources");
}

// --- INBOX ---
export async function deleteMessage(formData: FormData) {
  await prisma.contactMessage.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/inbox");
}

export async function addMember(formData: FormData) {
  await checkAuth("ADMIN");
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.teamMember.create({
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      session: formData.get("session") as string,
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      linkedin: formData.get("linkedin") as string,
      github: formData.get("github") as string,
    }
  });
  revalidatePath("/admin/team");
  revalidatePath("/team"); // Update public page
}

export async function updateMember(formData: FormData) {
  await checkAuth("ADMIN");
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  await prisma.teamMember.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      session: formData.get("session") as string,
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      linkedin: formData.get("linkedin") as string,
      github: formData.get("github") as string,
    }
  });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteMember(formData: FormData) {
  await checkAuth("ADMIN");
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  await prisma.teamMember.delete({ where: { id } });

  await logAction(
    "DELETE_MEMBER",
    `Deleted team member with ID: ${id}`
  );

  revalidatePath("/admin/team");
  revalidatePath("/team");
}
