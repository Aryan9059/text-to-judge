import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobPerfect — Master your coding interviews",
  description:
    "Turn vague coding ideas into structured problems. Practice with a high-speed AI judge and get interview-ready.",
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
          colorPrimary: "#b5b5f6",
          colorBackground: "#141318",
          colorText: "#eff1f6",
          colorInputBackground: "#1c1b22",
          colorInputText: "#eff1f6",
        },
      }}
    >
      <html
        lang="en"
        className={`${poppins.variable} ${jetbrainsMono.variable} dark antialiased h-full`}
      >
        <body className="h-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[#b5b5f6]/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
