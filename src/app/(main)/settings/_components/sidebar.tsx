// File: app/settings/_components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  Briefcase, 
  Palette, 
  Building,
  Menu
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  {
    title: "Account",
    href: "/settings#account",
    icon: UserCircle,
  },
  {
    title: "Brand",
    href: "/settings#brand",
    icon: Briefcase,
  },
  {
    title: "Identity",
    href: "/settings#identity",
    icon: Palette,
  },
  {
    title: "Business",
    href: "/settings#business",
    icon: Building,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  
  // Navigation items shared between mobile and desktop
  const NavItems = () => (
    <div className="space-y-1">
      {items.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            pathname === item.href && "bg-secondary"
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="w-64 border-r h-full p-4 hidden md:block">
        <NavItems />
      </nav>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden  top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}