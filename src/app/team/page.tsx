import { prisma } from "@/lib/prisma";
import TeamClient, { TeamData } from "@/components/TeamClient";

// --- SERVER-SIDE SORTING LOGIC ---
const CORE_ROLE_ORDER = [
  "president", "mentor", "vice president", "general secretary", "treasurer",
  "cultural head", "tech head", "tech head - iot", "tech head - ml", "tech head - web",
];

const ROLE_ALIASES: Record<string, string> = {
  "vice-president": "vice president",
  "technical head": "tech head",
  "techincal head": "tech head",
  "tech head iot": "tech head - iot",
  "tech head ml": "tech head - ml",
  "tech head web": "tech head - web",
};

const normalize = (v = "") => v.toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

const canonicalizeRole = (role: string) => {
  let r = normalize(role);
  for (const [bad, good] of Object.entries(ROLE_ALIASES)) {
    if (r.includes(bad)) r = good;
  }
  return r;
};

const getCorePriority = (role: string) => {
  const r = canonicalizeRole(role);
  for (let i = 0; i < CORE_ROLE_ORDER.length; i++) {
    const key = CORE_ROLE_ORDER[i];
    if (new RegExp(`^${key}(\\b|\\s|-|\\()`, "i").test(r)) return i;
  }
  return 999;
};

// --- SERVER COMPONENT ---
export default async function TeamPage() {
  // 1. Fetch data directly from DB (no API call needed)
  const members = await prisma.teamMember.findMany({ 
    orderBy: { createdAt: "asc" } 
  });

  // 2. Process data into the required structure
  const teamData: any = {};

  for (const member of members) {
    const session = member.session;
    const isCore = getCorePriority(member.role) !== 999;
    const category = isCore ? "core" : member.category.toLowerCase();

    if (!teamData[session]) teamData[session] = { core: [], executive: [] };
    if (!teamData[session][category]) teamData[session][category] = [];

    teamData[session][category].push({
      name: member.name,
      por: member.role,
      img: member.image || "",
      socials: { 
        linkedin: member.linkedin || undefined, 
        github: member.github || undefined 
      },
      __priority: isCore ? getCorePriority(member.role) : 999,
    });
  }

  // 3. Sort Core Members by Priority
  Object.values(teamData).forEach((year: any) => {
    if (Array.isArray(year.core)) {
      year.core.sort((a: any, b: any) => a.__priority - b.__priority);
      // Clean up internal priority field
      year.core.forEach((m: any) => delete m.__priority);
    }
  });

  // 4. Determine default year (Latest)
  const years = Object.keys(teamData).sort().reverse();
  const initialYear = years.length > 0 ? years[0] : "";

  // 5. Pass to Client Component
  return <TeamClient initialData={teamData as TeamData} initialYear={initialYear} />;
}