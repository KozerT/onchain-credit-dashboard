"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { NavList } from "@/components/NavList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@repo/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* ─── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <BrandLogo />
          <ThemeToggle />
        </div>
        <div className="p-4">
          <NavList />
        </div>
      </aside>

      {/* ─── Mobile Header ──────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0">
              {/* Header Section inside Sheet */}
              <SheetHeader className="h-16 justify-center border-b px-6 text-left">
                <SheetTitle>
                  <BrandLogo />
                </SheetTitle>
              </SheetHeader>

              <div className="p-4">
                {/* Mobile close menu on click */}
                <NavList onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ─── Main Content Wrapper ───────────────────────────────────────── */}
      <main className="flex-1 pt-16 lg:pl-64 lg:pt-0">{children}</main>
    </div>
  );
}
