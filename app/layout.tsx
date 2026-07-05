import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SkillQuest AI",
    template: "%s | SkillQuest AI"
  },
  description:
    "SkillQuest AI turns studying into an adventure with quests, XP, achievements, boss quizzes, and an AI tutor.",
  applicationName: "SkillQuest AI"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfaf7"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
