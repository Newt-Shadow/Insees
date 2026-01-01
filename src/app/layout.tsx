import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Orbitron } from "next/font/google";
import GlobalLoader from "@/components/GlobalLoader";
import { Footer } from "@/components/Footer";
import CyberOverlay from "@/components/CyberOverlay";
import CommandPalette from "@/components/CommandPalette";
import ScrollToTop from "@/components/ScrollToTop";
import PreLoader from "@/components/PreLoader";
import { PreloaderProvider } from "@/app/context/PreloaderContext"; // Import Provider

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600", "700", "800"], 
  variable: "--font-poppins",
  display: "swap" 
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"], 
  variable: "--font-orbitron",
  display: "swap" 
});


export const metadata: Metadata = {
  metadataBase: new URL("https://insees.tech"),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "INSEES ",
    template: "%s | INSEES",
  },

  description:
    "The Instrumentation and Electronics Engineering Society (INSEES) at NIT Silchar. Driving innovation in robotics, IoT, embedded systems, and automation.",

  keywords: [
    "INSEES",
    "NIT Silchar",
    "Instrumentation Engineering",
    "Electronics Society",
    "Robotics Club India",
    "Embedded Systems NIT",
    "IoT Projects",
    "Student Tech Society",
    "Technical Club NIT",
  ],

  openGraph: {
    title: "INSEES ",
    description:
      "Society Of Electronics and Instrumentation Department of NIT Silchar. Robotics, electronics, IoT, and innovation.",
    url: "https://insees.tech",
    siteName: "INSEES",
    locale: "en_US",
    type: "website",
    
  },

  twitter: {
    card: "summary_large_image",
    title: "INSEES - NIT Silchar",
    description:
      "Instrumentation and Electronics Engineering Society | Innovating the future.",
    
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "mpuppQm7zAOHGx4sgFzB1lkF5TSDhY-uIj71PpXsCdM",
  },

  authors: [{ name: "INSEES Tech Team" }],
  category: "technology",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${orbitron.variable} bg-black text-white overflow-x-hidden`}>
        <PreloaderProvider>
          <GlobalLoader>
            {/* Global Effects */}
           
            
            {/* The Boot Sequence */}
            <PreLoader />
            
            {/* Utilities */}
            <CommandPalette />
            
            {/* Main Content */}
            {children}
            
            {/* Footer - Note: Links inside Footer do NOT have onClick={triggerBoot}, so no animation */}
            <Footer />
            <ScrollToTop />
          </GlobalLoader>
        </PreloaderProvider>
      </body>
    </html>
  );
}
