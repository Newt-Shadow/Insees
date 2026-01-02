import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha Crescendo | INSEES NIT Silchar",
  description:
    "Alpha Crescendo is the flagship annual techno-cultural fest of INSEES, the Official Technical and Cultural Society of Electronics and Instrumentation Department (EIE) of NIT Silchar. Experience innovation, competitions, workshops, and celebrations.",

  keywords: [
    "Alpha Crescendo",
    "Alpha Crescendo NIT Silchar",
    "INSEES Fest",
    "Techno Cultural Fest NIT Silchar",
    "Instrumentation Electronics Fest",
    "NIT Silchar Events",
  ],

  alternates: {
    canonical: "/alpha-crescendo",
  },

  openGraph: {
    title: "Alpha Crescendo | INSEES NIT Silchar",
    description:
      "Discover Alpha Crescendo — the flagship techno-cultural fest of INSEES at NIT Silchar, featuring technical events, workshops, competitions, and innovation.",
    url: "https://insees.in/alpha-crescendo",
    siteName: "INSEES",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://insees.in/image.png",
        width: 1200,
        height: 630,
        alt: "Alpha Crescendo — INSEES NIT Silchar",
      },
    ],
    
  },

  twitter: {
    card: "summary_large_image",
    title: "Alpha Crescendo | INSEES NIT Silchar",
    description:
      "The flagship techno-cultural fest of INSEES at NIT Silchar — innovation, technology, and celebration.",
    images: ["https://insees.in/image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
