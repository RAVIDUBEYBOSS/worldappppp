import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import Web3Provider from "@/components/Web3Provider"; // 👈 NEW IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolsJet World",
  description: "Mini App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wagmi Provider ko sabse bahar rakho */}
        <Web3Provider> 
          <MiniKitProvider>
            {children}
          </MiniKitProvider>
        </Web3Provider>
      </body>
    </html>
  );
}