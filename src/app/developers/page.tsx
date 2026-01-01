import { Navbar } from "@/components/navbar";
import DevelopersContent from "@/components/DevelopersContent";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Ensure we always get the latest DB data

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    orderBy: { createdAt: 'asc' } 
  });

  return (
    <>
      <Navbar />
      <DevelopersContent initialDevelopers={developers} />
    </>
  );
}