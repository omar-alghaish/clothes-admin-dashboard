"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Package, 
  ShoppingBag, 
  Tags, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Tags,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: ShoppingBag,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed">
      <div className="text-xl font-bold mb-8">StyleShop Admin</div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-gray-700",
                pathname === item.href && "bg-gray-700"
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
}