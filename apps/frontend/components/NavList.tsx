"use client";

import { cn } from "@repo/ui/lib/utils";
import { Building2, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Institutions", icon: Building2 },
  // TODO: Uncomment when Portfolio Manager page is implemented
  // { href: "/portfolio", label: "Portfolio Manager", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Shield },
];

interface NavListProps {
  onLinkClick?: () => void;
}

export function NavList({ onLinkClick }: NavListProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
