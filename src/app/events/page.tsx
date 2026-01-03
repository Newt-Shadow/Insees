import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* =========================
   METADATA (SEO)
========================= */
export const metadata: Metadata = {
  title: "Events | INSEES NIT Silchar",
  description:
    "Explore upcoming and past events, hackathons, workshops, and flagship programs organized by INSEES, the official Electronics and Instrumentation Engineering Society of NIT Silchar.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events | INSEES NIT Silchar",
    description:
      "Discover technical, cultural, and flagship events conducted by INSEES at NIT Silchar.",
    url: "https://insees.in/events",
    siteName: "INSEES",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* =========================
   PAGE (SSR)
========================= */
export default async function EventsPage() {
  // ✅ SERVER-SIDE FETCH (SSR)
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  /* =========================
     STRUCTURED DATA (JSON-LD)
  ========================= */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "Event",
      position: index + 1,
      name: event.title,
      description: event.description,

      ...(event.date && {
        startDate: new Date(event.date).toISOString(),
      }),

      eventStatus:
        event.status === "cancelled"
          ? "https://schema.org/EventCancelled"
          : "https://schema.org/EventScheduled",

      eventAttendanceMode:
        "https://schema.org/OfflineEventAttendanceMode",

      location: {
        "@type": "Place",
        name: event.location || "NIT Silchar",
        address: {
          "@type": "PostalAddress",
          streetAddress: "NIT Silchar",
          addressLocality: "Silchar",
          addressRegion: "Assam",
          postalCode: "788010",
          addressCountry: "IN",
        },
      },

      ...(event.image && { image: [event.image] }),

      organizer: {
        "@type": "Organization",
        name: "INSEES",
        url: "https://insees.in",
      },
    })),
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black">
      {/* ✅ Google Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <EventsClient initialEvents={events} />
    </div>
  );
}
