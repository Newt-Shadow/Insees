import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";


const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","600","700","800"], display: "swap" });


export const metadata: Metadata = {
  title: "INSEES — NIT Silchar",
  description: "Instrumentation and Electronics Engineering Society, NIT Silchar",
  icons: {
    icon: "/favicon.ico", // ✅ favicon path
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className={`${poppins.className} bg-heroRadial`}>{children}</body>
</html>
);
}