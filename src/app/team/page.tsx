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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team`, {
    cache: "no-store",
  });

  const teamData = await res.json();

  const years = Object.keys(teamData).sort().reverse();
  const initialYear = years[0] ?? "";

  return <TeamClient initialData={teamData} initialYear={initialYear} />;
}
