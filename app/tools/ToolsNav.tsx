"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { toolCategories } from "../data/toolCategories";

const navItems = [
  { name: "All Tools", path: "/tools" },
  ...toolCategories.map((category) => ({
    name: category.name,
    path: `/tools/${category.slug}`,
  })),
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
