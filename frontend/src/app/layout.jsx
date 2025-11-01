import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: {
    default: "Clinic Management System",
    template: "%s | Clinic Management",
  },
  description: "Comprehensive SaaS platform for managing medical clinics",
  keywords: ["clinic", "management", "healthcare", "medical", "appointments"],
  authors: [{ name: "Your Company" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Clinic Management System",
    description: "Comprehensive SaaS platform for managing medical clinics",
    siteName: "Clinic Management System",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
