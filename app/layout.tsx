import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Modern ecommerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white antialiased">
        <Providers>
          
          {/* 🔹 GLOBAL TOASTER */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                backgroundColor: "#1a1f1a",
                color: "#c7f9cc",
                border: "1px solid #37b24d",
                borderRadius: "8px",
              },
              success: {
                style: {
                  backgroundColor: "#0f5132",
                  color: "#d1e7dd",
                },
              },
              error: {
                style: {
                  backgroundColor: "#842029",
                  color: "#f8d7da",
                },
              },
            }}
          />

          {/* 🔹 PAGE CONTENT */}
          {children}

        </Providers>
      </body>
    </html>
  );
}