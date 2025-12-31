import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/**
 * Load team.json from public/data
 */
const TEAM_JSON_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "team.json"
);

const raw = fs.readFileSync(TEAM_JSON_PATH, "utf-8");
const teamData = JSON.parse(raw);

/**
 * Helpers
 */
const normalize = (url = "") => {
  return url
    .trim()
    .replace(/^www\./, "https://www.")
    .replace(/^http:\/\//, "https://")
    .replace(/\/$/, "")
    .replace(/\?.*$/, "") // remove tracking params
    .replace("/@", "/");  // instagram @username
};

async function main() {
  console.log("🔍 Validating DB against team.json...\n");

  let errorCount = 0;

  for (const [yearLabel, groups] of Object.entries(teamData)) {
    const year = await prisma.year.findUnique({
      where: { label: yearLabel },
      include: { members: true },
    });

    if (!year) {
      console.error(`❌ Missing YEAR: ${yearLabel}`);
      errorCount++;
      continue;
    }

    for (const [groupKey, members] of Object.entries(groups)) {
      const type = groupKey === "core" ? "CORE" : "EXECUTIVE";

      for (const member of members) {
        const dbMember = year.members.find(
          (m) => m.name === member.name && m.type === type
        );

        if (!dbMember) {
          console.error(
            `❌ Missing MEMBER: ${member.name} (${yearLabel}, ${type})`
          );
          errorCount++;
          continue;
        }

        const dbSocials = dbMember.socials || {};

        for (const key of ["instagram", "facebook", "linkedin"]) {
          if (
            normalize(dbSocials[key]) !==
            normalize(member.socials[key])
          ) {
            console.error(
              `❌ LINK MISMATCH
   Name : ${member.name}
   Year : ${yearLabel}
   Type : ${type}
   Field: ${key}
   DB   : "${normalize(dbSocials[key])}"
   JSON : "${normalize(member.socials[key])}"
`
            );
            errorCount++;
          }
        }
      }
    }
  }

  if (errorCount === 0) {
    console.log("✅ ALL MEMBERS & LINKS MATCH PERFECTLY");
  } else {
    console.error(
      `\n❌ Validation finished with ${errorCount} issue(s)`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
