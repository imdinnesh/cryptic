import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptic – Online Encryption & Decryption Tool",
  description:
    "Cryptic is a secure, client-side tool to encrypt and decrypt text using AES, RSA, and Base64.",
  keywords: ["encryption", "decryption", "AES", "RSA", "Base64", "secure", "online", "tool"],
  metadataBase: new URL("https://crypto.starbyte.tech"),
  openGraph: {
    title: "Cryptic – Free Online Encryption Tool",
    description: "Encrypt and decrypt text securely using AES, RSA, and Base64.",
    url: "https://crypto.starbyte.tech",
    siteName: "Cryptic",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cryptic – Free Online Encryption Tool",
    description: "Client-side encryption tool for AES, RSA, and Base64.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Cryptic",
              applicationCategory: "SecurityApplication",
              operatingSystem: "All",
              url: "https://crypto.starbyte.tech",
              description:
                "Cryptic is a secure tool for AES, RSA, and Base64 encryption and decryption, running entirely on the client side.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}