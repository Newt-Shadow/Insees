const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "insees/gallery",
    public_id: uuidv4(),
  });
  return result.secure_url;
}

async function main() {
  // 1. Events
  await prisma.event.createMany({
    data: [
      { title: "Alpha Cresando", highlight: "Supercharge collaboration.", description: "We provide unlimited repositories...", color: "amber", icon: "FaRocket" },
      { title: "Farewell Party", highlight: "Accelerate high-quality software development.", description: "Our platform drives innovation...", color: "green", icon: "FaGraduationCap" },
      { title: "Freshers Party", highlight: "Accelerate high-quality software development.", description: "Our platform drives innovation...", color: "blue", icon: "FaUsers" },
    ],
    skipDuplicates: true,
  });

  // 2. Gallery
  const galleryConfig = await prisma.galleryConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { driveLink: "https://drive.google.com/drive/folders/12345" },
  });

  const galleryItems = [
    { src: "1.jpg", category: "Alpha Cresando" },
    { src: "2.png", category: "Alpha Cresando" },
    { src: "3.jpg", category: "Orientation" },
    { src: "4.jpeg", category: "Orientation" },
    { src: "5.png", category: "Freshers" },
    { src: "6.png", category: "Freshers" },
    { src: "7.png", category: "Farewell" },
    { src: "8.png", category: "Farewell" },
    { src: "9.jpg", category: "Alpha Cresando" },
    { src: "10.jpeg", category: "Freshers" },
  ];

  for (const item of galleryItems) {
    const localPath = path.resolve("public/gallery", item.src);
    if (!fs.existsSync(localPath)) continue;
    const uploadedUrl = await uploadImage(localPath);

    await prisma.gallery.create({
      data: {
        src: uploadedUrl,
        category: item.category,
        galleryConfigId: galleryConfig.id,
      },
    });
  }

  // 3. Semesters + Files
  const semesters = [
    {
      title: "1st Semester Study Material",
      files: [
        { name: "Engineering Mathematics.pdf", url: "/files/1st/math.pdf" },
        { name: "Basic Electronics.docx", url: "/files/1st/electronics.docx" },
      ],
    },
    {
      title: "2nd Semester Study Material",
      files: [{ name: "Physics Notes.pdf", url: "/files/2nd/physics.pdf" }],
    },
  ];

  for (const sem of semesters) {
    const semRecord = await prisma.semester.create({
      data: { title: sem.title },
    });

    const subject = await prisma.subject.create({
      data: { name: "General", semesterId: semRecord.id },
    });

    for (const f of sem.files) {
      await prisma.file.create({
        data: { ...f, subjectId: subject.id },
      });
    }
  }

  // 4. Members
  const teams = {
    "2024-25": {
      core: [
        {
          name: "Bhawna Bharti",
          por: "President",
          img: "/members/",
          socials: { instagram: "https://instagram.com/", facebook: "", linkedin: "https://linkedin.com/" },
        },
      ],
      executive: [
        { name: "Anmol", por: "executive", img: "/members/", socials: { instagram: "", facebook: "", linkedin: "https://linkedin.com/in" } },
        { name: "Shubham", por: "executive", img: "/members/", socials: { instagram: "", facebook: "", linkedin: "https://linkedin.com/in" } },
      ],
    },
  };

  for (const [yearLabel, roles] of Object.entries(teams)) {
    const yearRecord = await prisma.year.upsert({
      where: { label: yearLabel },
      update: {},
      create: { label: yearLabel },
    });

    for (const member of roles.core) {
      await prisma.member.create({
        data: {
          name: member.name,
          por: member.por,
          img: member.img,
          socials: member.socials,
          type: "CORE",
          yearId: yearRecord.id,
        },
      });
    }

    for (const member of roles.executive) {
      await prisma.member.create({
        data: {
          name: member.name,
          por: member.por,
          img: member.img,
          socials: member.socials,
          type: "EXECUTIVE",
          yearId: yearRecord.id,
        },
      });
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
