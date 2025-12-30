import { Navbar } from "../components/navbar";
import { FloatingIcon } from "../components/FloatingIcon";
import { EmailForm } from "../components/EmailForm";
import { ScrollHint } from "../components/ScrollHint";
import ContactSection from "../components/ContactSection";
import { EventsTimeline } from "../components/EventsTimeline";
import { AboutSection } from "../components/AboutSection";
import MeetDevelopersButton from "@/components/MeetDevelopersButton";
import CelebrationWrapper from "@/components/CelebrationWrapper";
import eventsData from "./../../public/data/events.json"; // ✅ build-time fallback
import ScrollToTop from "@/components/ScrollToTop";

// ✅ Try API first, fallback to build-time JSON
async function getEvents() {
  try {
    const res = await fetch("/api/events", {
      // For SSR on every request:
      // cache: "no-store"

      // For SSG (build-time static):
      next: { revalidate: 60 }, // revalidate every 60s
    });

    if (!res.ok) throw new Error("API not ready");
    return res.json();
  } catch {
    // ✅ fallback to build-time local JSON
    return eventsData;
  }
}

export default async function Home() {
  // Add this script inside your Home component's return statement
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "StudentOrganization", // Specific type for societies
        "name": "INSEES",
        "alternateName": "Instrumentation and Electronics Engineering Society",
        "url": "https://insees.tech",
        "logo": "https://insees.tech/favicon.ico",
        "foundingDate": "2000", // Update with actual date
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "NIT Silchar, Cachar",
          "addressLocality": "Silchar",
          "addressRegion": "Assam",
          "postalCode": "788010",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.linkedin.com/company/insees-nits",
          "https://www.instagram.com/insees_nits",
          "https://www.facebook.com/insees"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "inseessociety.nits@gmail.com",
          "contactType": "sponsorship inquiries"
        }
      }),
    }}
  />
  const events = await getEvents();

  const glowColors = {
    blue: "shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]",
    green: "shadow-[0_0_20px_6px_rgba(34,197,94,0.6)]",
    amber: "shadow-[0_0_20px_6px_rgba(245,158,11,0.6)]",
    orange: "shadow-[0_0_20px_6px_rgba(249,115,22,0.6)]",
  };

  return (
    <>
      <Navbar />
      {/* <CelebrationWrapper /> */}

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-white font-[Poppins,sans-serif] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_40%,rgba(255,255,255,.06),transparent)]" />

        {/* Floating Electronics Icons */}
        <FloatingIcon
          className={`absolute rounded-xl p-[3px] top-[28%] left-[12%] ${glowColors.amber}`}
          color="amber"
          src="/resistor.svg"
          float={24}
          delay={0.4}
        />
        <FloatingIcon
          className={`absolute top-[17%] rounded-xl p-[3px] left-1/2 -translate-x-1/2 ${glowColors.blue}`}
          color="blue"
          src="/capacitor.svg"
          float={22}
          delay={0.8}
        />
        <FloatingIcon
          className={`absolute rounded-xl p-[3px] bottom-[20%] left-[18%] ${glowColors.green}`}
          color="green"
          src="/led.svg"
          float={20}
          delay={1.2}
        />
        <FloatingIcon
          className={`absolute rounded-xl p-[3px] top-[24%] right-[12%] ${glowColors.orange}`}
          color="orange"
          src="/ic.svg"
          float={26}
          delay={1.6}
        />

        {/* Center Title + Form */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold  tracking-wide bg-gradient-to-t from-gray-300 to-white text-transparent bg-clip-text">
            INSEES
          </h1>
          <p className="mt-6 font-orbitron text-base md:text-lg text-gray-300 max-w-2xl">
            Instrumentation and Electronics Engineering Society. <br />
            National Institute of Technology, Silchar.
          </p>
          <EmailForm />
        </div>

        <ScrollHint />
      </main>

      {/* Sections */}
      <AboutSection />
      <EventsTimeline events={events} /> {/* ✅ Events with fallback */}
      <div id="contact" className="bg-black/70 py-2 mt-1">
        <ContactSection />
      </div>


    </>
  );
}
