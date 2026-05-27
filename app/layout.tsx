import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anveshna.devxoshakya.xyz"),
  title: {
    default: "Anveshna | Watch Anime Online",
    template: "%s | Anveshna",
  },
  description:
    "Discover, stream, and explore anime with curated recommendations, trending titles, and a fast search experience.",
  applicationName: "Anveshna",
  keywords: [
    "anime streaming",
    "watch anime online",
    "anime search",
    "trending anime",
    "anime recommendations",
    "anime anveshna streaming dev shakya akshita srivastava github anveshna",
    "hls anime chat",
    "ai recommendation of anime",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Anveshna | Watch Anime Online",
    description:
      "Discover, stream, and explore anime with curated recommendations, trending titles, and a fast search experience.",
    url: "/",
    siteName: "Anveshna",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anveshna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anveshna | Watch Anime Online",
    description:
      "Discover, stream, and explore anime with curated recommendations, trending titles, and a fast search experience.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="79f5ac77-a884-49cf-92a7-8d7bbeefe0c8"></script>
      </head>
      <body
        className={`${nunito.variable} ${ptSans.variable} ${instrumentSerif.variable} ${inter.variable} antialiased relative hide-scrollbar`}
      >
        <StyledComponentsRegistry>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="texture" />
          {children}
        </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
