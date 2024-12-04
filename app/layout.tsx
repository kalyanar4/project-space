import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Mars Machines Portfolio",
  description: "Explore the advanced tools and experiments of the cosmos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-foreground">
          {/* Header */}
          <header className="p-6 border-b border-gray-800 flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-semibold">
              🚀 Mars Machines
            </h1>
            <nav>
              <ul className="flex space-x-6 text-sm sm:text-base">
                <li><a href="/">Home</a></li>
                <li><a href="/tech-stack">Tech Stack</a></li>
                <li><a href="/projects">Projects</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/tools">Tools</a></li>
              </ul>
            </nav>
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
                    <a
                      href="/about"
                      className="hover:text-white transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Copyright */}
              <div>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Mars Machines. All rights reserved.
                </p>
              </div>
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}
