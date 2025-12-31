import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* =====================================================
   CANONICAL CORE ROLE ORDER
===================================================== */
const CORE_ROLE_ORDER = [
  "president",
  "mentor",
  "vice president",
  "general secretary",
  "treasurer",
  "cultural head",
  "tech head",
  "tech head - iot",
  "tech head - ml",
  "tech head - web",
]

/* =====================================================
   ROLE ALIASES / FIXES (CRITICAL)
===================================================== */
const ROLE_ALIASES: Record<string, string> = {
  "vice-president": "vice president",
  "vicepresident": "vice president",

  "technical head": "tech head",
  "techincal head": "tech head", // misspelling
  "technical head - iot": "tech head - iot",
  "techincal head - iot": "tech head - iot",

  "tech head iot": "tech head - iot",
  "tech head ml": "tech head - ml",
  "tech head web": "tech head - web",
}

/* =====================================================
   NORMALIZE + CANONICALIZE ROLE
===================================================== */
const normalize = (v = "") =>
  v
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()

const canonicalizeRole = (role: string) => {
  let r = normalize(role)

  // fix aliases / misspellings
  for (const [bad, good] of Object.entries(ROLE_ALIASES)) {
    if (r.includes(bad)) {
      r = good
    }
  }

  return r
}

/* =====================================================
   RESOLVE PRIORITY (NOW FOOLPROOF)
===================================================== */
const getCorePriority = (role: string) => {
  const r = canonicalizeRole(role)

  for (let i = 0; i < CORE_ROLE_ORDER.length; i++) {
    const key = CORE_ROLE_ORDER[i]
    const regex = new RegExp(`^${key}(\\b|\\s|-|\\()`, "i")
    if (regex.test(r)) return i
  }

  return 999
}

/* =====================================================
   API HANDLER
===================================================== */
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    })

    const teamData: Record<string, any> = {}

    for (const member of members) {
      const session = member.session

      const isCore = getCorePriority(member.role) !== 999
      const category = isCore ? "core" : normalize(member.category)

      if (!teamData[session]) teamData[session] = {}
      if (!teamData[session][category]) teamData[session][category] = []

      teamData[session][category].push({
        name: member.name,
        por: member.role,
        img: member.image,
        socials: {
          linkedin: member.linkedin,
          github: member.github,
        },
        __priority: isCore ? getCorePriority(member.role) : 999,
      })
    }

    /* =================================================
       HARD SORT — PER YEAR
    ================================================= */
    Object.values(teamData).forEach((year: any) => {
      if (Array.isArray(year.core)) {
        year.core.sort((a: any, b: any) => a.__priority - b.__priority)
        year.core.forEach((m: any) => delete m.__priority)
      }
    })

    return NextResponse.json(teamData)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    )
  }
}
