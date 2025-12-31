import { prisma } from "@/lib/prisma";
import TeamManager from "@/components/admin/TeamManager";

export default async function AdminTeamPage() {
  // Fetch all members sorted by creation date
  const team = await prisma.teamMember.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });

  return <TeamManager initialData={team} />;
}