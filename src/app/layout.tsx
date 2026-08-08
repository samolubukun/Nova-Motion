import type { Metadata } from "next";
import "./globals.css";
import { StudioProvider } from "@/lib/studio-store";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: "Novamotion - AI Video Generation Studio",
  description: "Next-gen AI Storyboards, Motion Graphics, Explainer & Stock Video Engine",
  icons: {
    icon: "/novamotion.png",
    shortcut: "/novamotion.png",
    apple: "/novamotion.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080b11] text-slate-100 min-h-screen`}
      >
        <StudioProvider>
          {children}
        </StudioProvider>
      </body>
    </html>
  );
}

