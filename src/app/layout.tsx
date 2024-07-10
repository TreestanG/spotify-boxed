import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Boxed",
  metadataBase: new URL('https://boxed.tristangee.com'),
  description: "Spotify Wrapped for the impatient. Upload your Spotify data and get your stats instantly.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boxed.tristangee.com",
    siteName: "Spotify Boxed",
    title: "Spotify Wrapped for the impatient.",
    description: "Spotify Wrapped for the impatient. Upload your Spotify data and get your stats instantly.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Spotify_wrapped",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-spotify-bg ",inter.className)}>{children}</body>
    </html>
  );
}
