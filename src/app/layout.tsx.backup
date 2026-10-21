import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono-basira",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Basira — Turn exam anxiety into exam readiness",
  description:
    "Basira turns exam preparation into a daily learning journey — one lesson, one question, one insight at a time.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mist text-ink font-body">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const theme = localStorage.getItem("basira-theme");

                  if (
                    theme === "dark" ||
                    (
                      !theme &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                    )
                  ) {
                    document.documentElement.classList.add("dark");
                  }
                } catch {}
              })();
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}