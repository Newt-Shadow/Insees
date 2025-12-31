// src/app/team/page.tsx
import TeamClient from "@/components/TeamClient";
import { getTeamData } from "@/lib/team-data"; // Import the new function

export const dynamic = "force-dynamic"; // Ensure it doesn't cache statically if data changes often

export default async function TeamPage() {
  // Call the function directly (Server-side execution)
  const teamData = await getTeamData();

  const years = Object.keys(teamData).sort().reverse();
  const initialYear = years[0] ?? "";

  return <TeamClient initialData={teamData} initialYear={initialYear} />;
}