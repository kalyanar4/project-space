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
    <nav className="tool-nav">
      <div className="tool-nav-track">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={clsx("tool-nav-link", pathname === item.path && "active")}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
