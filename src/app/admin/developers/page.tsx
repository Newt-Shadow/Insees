import { prisma } from "@/lib/prisma";
import DeveloperManager from "@/components/admin/DeveloperManager";

export default async function AdminDevelopersPage() {
  const devs = await prisma.developer.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });

  return <DeveloperManager initialData={devs} />;
}