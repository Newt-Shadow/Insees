import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teamData = {
  "2024-25": {
    "core": [
      {
        "name": "Bhawna Bharti",
        "por": "Vice - President",
        "img": "/members/bhawna.jpg",
        "socials": { "instagram": "https://instagram.com/", "facebook": "", "linkedin": "https://linkedin.com/" }
      },
      {
        "name": "Sayanrup",
        "por": "Treasurer",
        "img": "/members/sayanrup.jpg",
        "socials": { "instagram": "https://www.instagram.com/__.excuse._.me.__/ ", "facebook": "", "linkedin": "" }
      },
      {
        "name": "Ankit Kumar",
        "por": "General Secretary",
        "img": "/members/ankit.jpeg",
        "socials": { "instagram": "https://www.instagram.com/ankit_2k3/ ", "facebook": "https://www.facebook.com/profile.php?id=100010729830424", "linkedin": "www.linkedin.com/in/ankit-kumar-barnwal-138a5a257" }
      }
    ],
    "executive": [
      { "name": "Ritik", "por": "Executive", "img": "/members/ritik.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Shubham", "por": "Executive", "img": "/members/subham.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Anmol", "por": "Executive", "img": "/members/Anmol.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Priya", "por": "Executive", "img": "/members/priya.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Agrima", "por": "Executive", "img": "/members/agrima.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Devanuj", "por": "Executive", "img": "/members/devanuj.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Aditya", "por": "Executive", "img": "/members/aditya.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Tanvi", "por": "Executive", "img": "/members/tanvi.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } }
    ]
  },
  "2025-26": {
    "core": [
      { "name": "Bhawna Bharti", "por": "President", "img": "/members/bhawna.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Ankit Kumar", "por": "Mentor", "img": "/members/ankit.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Agrima", "por": "Vice-President", "img": "/members/agrima.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Anmol", "por": "General Secretary", "img": "/members/Anmol.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Devanuj", "por": "Techincal Head - IoT", "img": "/members/devanuj.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Champakjyoti Konwar", "por": "Tech Head - ML", "img": "/members/champak.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Vivek Sharma", "por": "Tech Head - web", "img": "/members/vivek.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Aditya", "por": "Cultural Head", "img": "/members/aditya.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } }
    ],
    "executive": [
      { "name": "Srayashi", "por": "Executive", "img": "/members/srayashi.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Ankita", "por": "Executive", "img": "/members/ankita.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Harsha Deep", "por": "Executive", "img": "/members/harsha.webp", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Darpan", "por": "Executive", "img": "/members/darpan.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Kavish", "por": "Executive", "img": "/members/kavish.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Divya", "por": "Executive", "img": "/members/divya.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Param", "por": "Executive", "img": "/members/param.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Swapnil", "por": "Executive", "img": "/members/Swapnil.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Rhytham", "por": "Executive", "img": "/members/rythm.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Krish", "por": "Executive", "img": "/members/krish.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Abhishek", "por": "Executive", "img": "/members/abhisekh.png", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Parth", "por": "Executive", "img": "/members/parth.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Irfan", "por": "Executive", "img": "/members/irfan.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Nihar", "por": "Executive", "img": "/members/nihar.jpeg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } },
      { "name": "Yeah Hafizur", "por": "Executive", "img": "/members/yeah.jpg", "socials": { "instagram": "", "facebook": "", "linkedin": "" } }
    ]
  }
};

async function main() {
  console.log('🌱 Starting seed...');

  // Optional: Clear existing team data to avoid duplicates
  await prisma.teamMember.deleteMany({});

  for (const [session, categories] of Object.entries(teamData)) {
    // @ts-ignore
    for (const [categoryKey, members] of Object.entries(categories)) {
      // Map category key to Display Name (core -> Core, executive -> Executive)
      const category = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

      for (const member of members as any[]) {
        await prisma.teamMember.create({
          data: {
            name: member.name,
            role: member.por,
            image: member.img,
            session: session,
            category: category,
            linkedin: member.socials?.linkedin || "",
            github: member.socials?.github || "",
            // You can add instagram/facebook columns to schema if needed, or store in a JSON field
          }
        });
      }
    }
  }
  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });