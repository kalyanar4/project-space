import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { withBasePath } from "@/lib/basePath";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Digital Meta Portfolio",
  description: "Explore the advanced tools and experiments of the cosmos.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: withBasePath("favicon.ico"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          { "--globe-image": `url(${withBasePath("globe.svg")})` } as React.CSSProperties
        }
      >
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-foreground">
          {/* Header */}
          <header className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={withBasePath("dmz.png")}
                alt="Digital Meta Zone Logo"
                width={170}
                height={170}
                className="object-contain w-32 sm:w-40 h-auto"
                priority
              />
            </Link>
            <nav>
              <ul className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm sm:text-base">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/technology">Technology</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/tools">Tools</Link></li>
              </ul>
            </nav>
            <ThemeToggle />
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 p-6 border-t border-gray-800">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center max-w-7xl">
              {/* Footer Links */}
              <div>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Copyright */}
              <div>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} DMZ. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
