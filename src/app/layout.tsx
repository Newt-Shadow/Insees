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
  metadataBase: new URL("https://insees.in"),

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },

  alternates: {
    canonical: "/",
  },

  title: {
    default: "INSEES ",
    template: "%s | INSEES",
  },

  description:
    "The Instrumentation and Engineering Society (INSEES) is the official technical and cultural society of the Department of Electronics and Instrumentation at NIT Silchar",

  keywords: [
    "INSEES",
    "INSEES NIT Silchar",
    "Instrumentation and Electronics Engineering Society",
    "NIT Silchar",
    "EIE Department NIT Silchar",
    "Alpha Crescendo",
    "Electronics and Instrumentation Department NIT Silchar",
  ],

  openGraph: {
    title: "INSEES ",
    description:
      "Official technical & cultural society of the Department of Electronics and Instrumentation Engineering .",
    url: "https://insees.in",
    siteName: "INSEES",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://insees.in/og-v2.png",
        width: 1200,
        height: 630,
        alt: "INSEES - NIT Silchar",
        type: "image/png",
      },
      {
        url: "https://insees.in/og-v3.png",
        width: 1080,
        height: 1080,
        alt: "INSEES - NIT Silchar",
        type: "image/png",
      },
    ],

  },

  twitter: {
    card: "summary_large_image",
    title: "INSEES - NIT Silchar",
    description:
      "Official technical & cultural society of the Department of Electronics and Instrumentation Engineering.",
    images: ["https://insees.in/og-v2.png"],
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
