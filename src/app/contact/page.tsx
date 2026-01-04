import { Navbar } from "@/components/navbar";
import ContactSection from "./contact";
import { YellowBrickRoad } from "@/components/alpha/YellowBrickRoad"; // Optional: Adds your background effect

export default function ContactPage() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black font-sans">
      {/* Reusing your YellowBrickRoad background for consistency, or remove if unwanted */}
      {/* <YellowBrickRoad /> */}
      
      <Navbar />

      {/* Container with top padding to account for the fixed Navbar */}
      <div className="pt-20 md:pt-32 min-h-screen flex flex-col justify-center">
        <ContactSection />
      </div>
    </main>
  );
}