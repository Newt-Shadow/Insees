// src/lib/team-data.ts
import { prisma } from "@/lib/prisma";

type SocialLinks = {
  linkedin?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
};

type TeamMemberUI = {
  name: string;
  por: string;
  img?: string;
  socials: SocialLinks;
};

type TeamYear = {
  core?: TeamMemberUI[];
  executive?: TeamMemberUI[];
  [category: string]: TeamMemberUI[] | undefined;
};

type TeamData = Record<string, TeamYear>;


/* =====================================================
   CONSTANTS & HELPERS
===================================================== */
const CORE_ROLE_ORDER = [
  "president", "mentor", "vice president", "general secretary", "treasurer",
  "cultural head", "tech head", "tech head - iot", "tech head - ml", "tech head - web",
];

const ROLE_ALIASES: Record<string, string> = {
  "vice-president": "vice president",
  "vicepresident": "vice president",
  "technical head": "tech head",
  "techincal head": "tech head",
  "technical head - iot": "tech head - iot",
  "techincal head - iot": "tech head - iot",
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
    const regex = new RegExp(`^${key}(\\b|\\s|-|\\()`, "i");
    if (regex.test(r)) return i;
  }
  return 999;
};

/* =====================================================
   MAIN DATA FETCHING FUNCTION
===================================================== */
// src/lib/team-data.ts

// ... (keep existing imports and constants)

export async function getTeamData() {
  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: "asc" },
  });

  const teamData: TeamData = {};


  for (const member of members) {
    const session = member.session;
    const isCore = getCorePriority(member.role) !== 999;
    const category = isCore ? "core" : normalize(member.category);

    if (!teamData[session]) teamData[session] = {};
    if (!teamData[session][category]) teamData[session][category] = [];

    teamData[session][category].push({
      name: member.name,
      por: member.role,
      img: member.image ?? undefined,

      socials: {
        linkedin: member.linkedin ?? undefined,
        github: member.github ?? undefined,
        // --- ADD THESE LINES ---
        instagram: member.instagram ?? undefined,
        facebook: member.facebook ?? undefined,
        // ----------------------
      },
    });
  }

  // ... (keep the rest of the sorting logic)
  
  // SORTING
  Object.values(teamData).forEach((year) => {
    if (year.core) {
      year.core.sort((a, b) => getCorePriority(a.por) - getCorePriority(b.por));
    }
  });

  return teamData;
}