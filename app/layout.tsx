import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Text to Judge — AI-Powered Coding Challenges",
  description:
    "Turn vague coding ideas into structured problems with test cases. Write C++, run locally, get instant verdicts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#6d28d9",
          colorBackground: "#09090b",
          colorText: "#ffffff",
          colorInputBackground: "#18181b",
          colorInputText: "#ffffff",
        },
      }}
    >
      <html
        lang="en"
        className={`${outfit.variable} ${jetbrainsMono.variable} dark antialiased h-full`}
      >
        <body className="h-full bg-zinc-950 text-white font-sans selection:bg-violet-500/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
