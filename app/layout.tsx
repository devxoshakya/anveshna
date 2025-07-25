import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Anveshna.",
  description: "Anime streaming platform",
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
        className={`${nunito.variable} ${ptSans.variable} antialiased relative hide-scrollbar`}
      >
        <StyledComponentsRegistry>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
