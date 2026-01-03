"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const DeveloperSchema = z.object({
  name: z.string().min(2, "Name too short"),
  role: z.string().min(2, "Role required"),
  github: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  image: z.string().optional(),
  category: z.string().default("Junior"),
});

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
  const name = formData.get("name") as string;

  const rawData = {
    name: name,
    role: formData.get("role"),
    github: formData.get("github"),
    linkedin: formData.get("linkedin"),
    image: formData.get("image"),
    category: formData.get("category"),
  };

  const result = DeveloperSchema.safeParse(rawData);

  if (!result.success) {
    console.error(result.error.flatten());
    throw new Error("Invalid form data");
  }

  await prisma.developer.create({
    data: {
      name: result.data.name,
      role: result.data.role,
      image: result.data.image,
      github: result.data.github,
      linkedin: result.data.linkedin,
      category: result.data.category,
    }
  });
  await logAction("CREATE_DEV", `Added developer: ${name}`);
  revalidatePath("/admin/developers");
  revalidatePath("/developers");
}

export async function updateDev(formData: FormData) {
  await checkAuth("ADMIN");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const rawData = {
    name: name,
    role: formData.get("role"),
    github: formData.get("github"),
    linkedin: formData.get("linkedin"),
    image: formData.get("image"),
    category: formData.get("category"),
  };

  const result = DeveloperSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error("Invalid form data");
  }

  await prisma.developer.update({
    where: { id },
    data: {
      name: result.data.name,
      role: result.data.role,
      image: result.data.image,
      github: result.data.github,
      linkedin: result.data.linkedin,
      category: result.data.category,
    }
  });
  await logAction("UPDATE_DEV", `Updated developer: ${name}`);
  revalidatePath("/admin/developers");
  revalidatePath("/developers");
}

export async function deleteDev(formData: FormData) {
  await checkAuth("ADMIN");
  const id = formData.get("id") as string;
  await prisma.developer.delete({ where: { id: formData.get("id") as string } });
  await logAction("DELETE_DEV", `Deleted developer ID: ${id}`); 
  revalidatePath("/admin/developers");
  revalidatePath("/developers");
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

// src/app/actions/admin.ts

export async function deleteUser(formData: FormData) {
  try {
    // 1. Check Permissions (Allow SUPER_ADMIN or ADMIN)
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;

    if (session?.user?.role !== "SUPER_ADMIN" && session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized: Insufficient permissions");
    }

    const userId = formData.get("userId") as string;
    if (!userId) throw new Error("No User ID provided");

    console.log(`Attempting to delete user: ${userId}`);

    // 2. Delete the user
    const user = await prisma.user.delete({ 
      where: { id: userId } 
    });

    // 3. Log the action
    await logAction("REJECT_USER", `Rejected/Deleted user: ${user.email}`);
    
    console.log("User deleted successfully");
    revalidatePath("/admin/users");
    
  } catch (error) {
    console.error("❌ DELETE USER FAILED:", error);
    // You might want to return an error state here if you switch to useFormState later
    throw error; 
  }
}

// --- RESOURCES ---
export async function addSemester(formData: FormData) {
  await checkAuth("ADMIN");
  const title = formData.get("title") as string;
  await prisma.semester.create({ data: { title: formData.get("title") as string } });
  await logAction("CREATE_SEMESTER", `Added semester: ${title}`);
  revalidatePath("/admin/resources");
}

export async function addSubject(formData: FormData) {
  await checkAuth("ADMIN");
  const name = formData.get("name") as string;
  await prisma.subject.create({
    data: {
      name: formData.get("name") as string,
      driveLink: formData.get("driveLink") as string,
      semesterId: formData.get("semesterId") as string,
    }
  });
  await logAction("CREATE_SUBJECT", `Added subject: ${name}`);
  revalidatePath("/admin/resources");
}

// --- INBOX ---
export async function deleteMessage(formData: FormData) {
  await checkAuth("ADMIN");
  const id = formData.get("id") as string;
  await prisma.contactMessage.delete({ where: { id: formData.get("id") as string } });
  await logAction("DELETE_MESSAGE", `Deleted message ID: ${id}`);
  revalidatePath("/admin/inbox");
}

// --- TEAM MEMBERS ---
export async function addMember(formData: FormData) {
  await checkAuth("ADMIN");
  const name = formData.get("name") as string;

  await prisma.teamMember.create({
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      session: formData.get("session") as string,
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      linkedin: formData.get("linkedin") as string,
      github: formData.get("github") as string,
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
    }
  });
  await logAction("CREATE_MEMBER", `Added team member: ${name}`);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function updateMember(formData: FormData) {
  await checkAuth("ADMIN");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

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
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
    }
  });
  await logAction("UPDATE_MEMBER", `Updated team member: ${name}`);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteMember(formData: FormData) {
  await checkAuth("ADMIN");

  const id = formData.get("id") as string;

  await prisma.teamMember.delete({ where: { id } });

  await logAction(
    "DELETE_MEMBER",
    `Deleted team member with ID: ${id}`
  );

  revalidatePath("/admin/team");
  revalidatePath("/team");
}