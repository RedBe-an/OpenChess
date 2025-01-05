
import type { Metadata } from "next";
import { Noto_Sans_KR, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
const NotoSans = Noto_Sans_KR({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenChess",
  description: "Find your chess openings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${NotoSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            {children}
            <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
