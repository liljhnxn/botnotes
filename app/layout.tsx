import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ChainNotes — On-Chain Notes on Botchain Mainnet",
  description:
    "A simple, decentralized on-chain notes dApp built on Botchain Mainnet. Store, manage, and edit your notes directly on the blockchain.",
  keywords: ["ChainNotes", "Botchain", "Mainnet", "Web3", "Blockchain", "Notes", "Decentralized"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-[#090d16] text-slate-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
