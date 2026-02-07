import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

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
  description: "Explore advanced tools and experiments.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const links = [
  { name: "Home", path: "/" },
  { name: "Technology", path: "/technology" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Tools", path: "/tools" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="app-shell">
          <header className="site-header glass-panel">
            <div className="site-header-inner">
              <Link href="/" className="flex items-center">
                <Image
                  src={`${basePath}/dmz.png`}
                  alt="Digital Meta Zone Logo"
                  width={156}
                  height={42}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>

              <nav className="site-nav">
                {links.map((link) => (
                  <Link key={link.path} href={link.path} className="site-nav-link">
                    {link.name}
                  </Link>
                ))}
              </nav>

              <ThemeToggle />
            </div>
          </header>

          <main className="main-content">{children}</main>

          <footer className="site-footer glass-panel">
            <div className="site-footer-inner">
              <div className="footer-links">
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
              <p>&copy; {new Date().getFullYear()} DMZ. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
