"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "All Tools", path: "/tools" },
  { name: "PDF Tools", path: "/tools/pdf" },
  { name: "AI Tools", path: "/tools/ai" },
  { name: "Dev Utilities", path: "/tools/developer" },
  { name: "UI Tools", path: "/tools/ui" },
  { name: "Data Viz", path: "/tools/data" },
  { name: "Daily Tools", path: "/tools/daily" },
];

export default function ToolsNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-gray-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex overflow-x-auto p-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={clsx(
              "px-4 py-2 rounded-md whitespace-nowrap transition-colors",
              pathname === item.path
                ? "bg-accent-color text-black font-semibold"
                : "hover:bg-gray-700"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
