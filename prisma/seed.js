// seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --------------------------
  // 1️⃣ Members by Year
  // --------------------------
  const membersData = {
    "2024-25": {
      core: [
        {
          name: "Bhawna Bharti",
          por: "President",
          img: "/members/",
          socials: {
            instagram: "https://instagram.com/",
            facebook: "",
            linkedin: "https://linkedin.com/"
          }
        }
      ],
      executive: [
        {
          name: "Anmol",
          por: "executive",
          img: "/members/",
          socials: {
            instagram: "",
            facebook: "",
            linkedin: "https://linkedin.com/in"
          }
        },
        {
          name: "Shubham",
          por: "executive",
          img: "/members/",
          socials: {
            instagram: "",
            facebook: "",
            linkedin: "https://linkedin.com/in"
          }
        }
      ]
    },
    "2025-26": {
      core: [
        {
          name: "Bhawna Bharti",
          por: "President",
          img: "",
          socials: {
            instagram: "",
            facebook: "https://facebook.com/",
            linkedin: ""
          }
        },
        {
          name: "Anmol",
          por: "executive",
          img: "/members/",
          socials: {
            instagram: "",
            facebook: "",
            linkedin: "https://linkedin.com/in"
          }
        },
        {
          name: "Agrima",
          por: "executive",
          img: "/members/",
          socials: {
            instagram: "",
            facebook: "",
            linkedin: "https://linkedin.com/in"
          }
        }
      ],
      executive: [
        {
          name: "Devanuj",
          por: "Treasurer",
          img: "",
          socials: {
            instagram: "https://instagram.com/",
            facebook: "",
            linkedin: ""
          }
        }
      ]
    }
  };

  for (const [yearLabel, teams] of Object.entries(membersData)) {
    const year = await prisma.year.create({
      data: {
        label: yearLabel,
        members: {
          create: [
            ...teams.core.map(member => ({ ...member, type: "CORE" })),
            ...teams.executive.map(member => ({ ...member, type: "EXECUTIVE" }))
          ]
        }
      }
    });
    console.log(`Created members for year: ${year.label}`);
  }

  // --------------------------
  // 2️⃣ Semesters -> Subjects -> Files
  // --------------------------
  const semesters = [
    {
      title: "1st Semester Study Material",
      subjects: [
        {
          name: "Engineering Mathematics",
          driveLink: "https://drive.google.com/drive/folders/1A2B3C_MATH",
          files: []
        },
        {
          name: "Basic Electronics",
          driveLink: null,
          files: [
            { name: "Basic Electronics Notes.pdf", url: "/files/1st/electronics_notes.pdf" },
            { name: "Basic Electronics Lab Manual.docx", url: "/files/1st/electronics_lab.docx" }
          ]
        },
        {
          name: "Engineering Drawing",
          driveLink: "https://drive.google.com/drive/folders/1A2B3C_DRAW",
          files: [
            { name: "Drawing Sheets.zip", url: "/files/1st/drawing_sheets.zip" }
          ]
        }
      ]
    },
    {
      title: "2nd Semester Study Material",
      subjects: [
        {
          name: "Physics",
          driveLink: "https://drive.google.com/drive/folders/2X3Y_PHYSICS",
          files: []
        },
        {
          name: "Chemistry",
          driveLink: null,
          files: [
            { name: "Chemistry Notes.pdf", url: "/files/2nd/chemistry.pdf" }
          ]
        }
      ]
    },
    {
      title: "3rd Semester Study Material",
      subjects: [
        {
          name: "Signals and Systems",
          driveLink: "https://drive.google.com/drive/folders/3S4T_SIGNALS",
          files: []
        },
        {
          name: "Digital Logic Design",
          driveLink: null,
          files: [
            { name: "DLD Lecture Notes.pdf", url: "/files/3rd/dld_notes.pdf" },
            { name: "DLD Assignments.docx", url: "/files/3rd/dld_assignments.docx" }
          ]
        }
      ]
    }
  ];

  for (const sem of semesters) {
    const semester = await prisma.semester.create({
      data: {
        title: sem.title,
        subjects: {
          create: sem.subjects.map(subj => ({
            name: subj.name,
            driveLink: subj.driveLink,
            files: {
              create: subj.files.map(f => ({
                name: f.name,
                url: f.url
              }))
            }
          }))
        }
      }
    });
    console.log(`Created semester: ${semester.title}`);
  }

  // --------------------------
  // 3️⃣ Events
  // --------------------------
  const events = [
    {
      title: "Alpha Crescendo",
      highlight: "Supercharge collaboration.",
      description: "We provide unlimited repositories, best-in-class version control, and the world's most powerful open source community—so your team can work more efficiently together.",
      color: "amber",
      icon: "FaRocket"
    },
    {
      title: "Farewell Party",
      highlight: "Accelerate high-quality software development.",
      description: "Our platform drives innovation with tools that boost developer velocity.",
      color: "green",
      icon: "FaGraduationCap"
    },
    {
      title: "Freshers Party",
      highlight: "Accelerate high-quality software development.",
      description: "Our platform drives innovation with tools that boost developer velocity.",
      color: "blue",
      icon: "FaUsers"
    }
  ];

  for (const ev of events) {
    await prisma.event.create({ data: ev });
    console.log(`Created event: ${ev.title}`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
