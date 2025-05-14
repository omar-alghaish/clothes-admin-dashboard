// src/components/AuthGuard.tsx
"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/auth/authSlice";

// Add routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    // Check if the current route requires authentication
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to login page immediately
      router.replace("/login");
    } else if (isAuthenticated && pathname === "/login") {
      // Redirect authenticated users away from login page
      router.replace("/products");
    }
  }, [isAuthenticated, pathname, router]);

  // If on a protected route and not authenticated, render nothing while redirecting
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null; // Return null to avoid flash of protected content
  }

  // Otherwise render the children
  return <>{children}</>;
}