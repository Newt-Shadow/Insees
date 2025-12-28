// // scripts/fetchSponsors.ts
// import fs from "fs";
// import path from "path";
// // import fetch from "node-fetch";
// import sharp from "sharp";
// import { alphaContent } from "../src/data/alphaCrescendoData";

// const OUT_DIR = path.join(process.cwd(), "public/sponsors");
// const META_FILE = path.join(OUT_DIR, "meta.json");

// if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// async function fetchWithFallback(domain: string) {
//   const sources = [
//     `https://logo.clearbit.com/${domain}`,
//     `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
//   ];

//   for (const url of sources) {
//     try {
//       const res = await fetch(url);
//       if (res.ok) return Buffer.from(await res.arrayBuffer());
//     } catch {}
//   }
//   return null;
// }

// async function generateSVG(name: string) {
//   return Buffer.from(`
//   <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
//     <rect width="100%" height="100%" rx="32" fill="#111"/>
//     <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
//       font-size="40" fill="#aaa">${name}</text>
//   </svg>`);
// }

// (async () => {
//   const meta: Record<string, string> = fs.existsSync(META_FILE)
//     ? JSON.parse(fs.readFileSync(META_FILE, "utf8"))
//     : {};

//   for (const s of alphaContent.sponsors.past) {
//     const imgPath = path.join(OUT_DIR, `${s.domain}.png`);

//     // 🔑 DO NOT RE-DOWNLOAD
//     if (fs.existsSync(imgPath)) {
//       console.log("↺ Skipped (exists):", s.domain);
//       continue;
//     }

//     let buffer = await fetchWithFallback(s.domain);
//     if (!buffer) buffer = await generateSVG(s.name);

//     // Normalize
//     await sharp(buffer)
//       .resize(256, 256, {
//         fit: "contain",
//         background: { r: 0, g: 0, b: 0, alpha: 0 },
//       })
//       .png()
//       .toFile(imgPath);

//     // Blur
//     const blur = await sharp(buffer).resize(10, 10).png().toBuffer();
//     meta[s.domain] = `data:image/png;base64,${blur.toString("base64")}`;

//     console.log("✔ Downloaded:", s.domain);
//   }

//   fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
// })();
