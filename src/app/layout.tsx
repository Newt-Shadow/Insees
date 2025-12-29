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
  title: "INSEES — NIT Silchar",
  description: "Instrumentation and Electronics Engineering Society, NIT Silchar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${orbitron.variable} bg-black text-white overflow-x-hidden`}>
        <PreloaderProvider>
          <GlobalLoader>
            {/* Global Effects */}
            <CyberOverlay />
            
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