import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import Providers from "./providers";

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
    <html lang="en" className="font-brand-sans">
      <body className="min-h-screen bg-white antialiased">
        <Providers>

          {/* 🔹 GLOBAL TOASTER */}
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{
              top: 20,
              right: 20,
              zIndex: 99999,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#111827",
                color: "#F9FAFB",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)",
                backdropFilter: "blur(12px)",
                maxWidth: "420px",
              },

              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#ffffff",
                },
                style: {
                  background: "#052e16",
                  color: "#dcfce7",
                  border: "1px solid #166534",
                },
              },

              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
                style: {
                  background: "#450a0a",
                  color: "#fee2e2",
                  border: "1px solid #991b1b",
                },
              },

              loading: {
                style: {
                  background: "#172554",
                  color: "#dbeafe",
                  border: "1px solid #1d4ed8",
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
