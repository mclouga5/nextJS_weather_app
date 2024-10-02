'use client'

// import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={geistSans.className}>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
