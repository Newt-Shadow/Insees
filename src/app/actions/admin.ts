"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"


// Helper for Logging
async function logAction(action: string, details: string) {
  const session = await getServerSession(authOptions);
  if (session?.user) {


    await prisma.auditLog.create({ data: { action, details, userId: session.user.id } });
  }
}




// --- DEVELOPERS ---
export async function addDev(formData: FormData) {
  await prisma.developer.create({
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      image: formData.get("image") as string,
      github: formData.get("github") as string,
    }
  });
  revalidatePath("/admin/developers");
}

export async function deleteDev(formData: FormData) {
  await prisma.developer.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/developers");
}

// --- USERS (SUPER ADMIN) ---
export async function updateUserRole(formData: FormData) {
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
