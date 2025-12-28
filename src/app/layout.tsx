import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Orbitron } from "next/font/google"; // Import Orbitron
import GlobalLoader from "@/components/GlobalLoader";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600", "700", "800"], 
  variable: "--font-poppins",
  display: "swap" 
});

// The "Wizard of Oz" font
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"], 
  variable: "--font-orbitron",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "INSEES — NIT Silchar",
  description: "Instrumentation and Electronics Engineering Society, NIT Silchar",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${orbitron.variable} bg-heroRadial`}>
        <GlobalLoader>
          {children}
        </GlobalLoader>
      </body>
    </html>
  );
}