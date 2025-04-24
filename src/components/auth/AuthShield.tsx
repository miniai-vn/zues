"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthShieldProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export default function AuthShield({
  children,
  publicRoutes = ["/login", "/register", "/forgot-password", "/forgot-password/reset", "/forgot-password/reset/success"],
}: AuthShieldProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Verify if we're on a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
      // No token and trying to access protected route
      router.push("/login");
    } else if (token && storedUser && isPublicRoute && pathname !== "/login") {
      // Has token but on public route (except login which might have redirect logic)
      router.push("/dashboard");
    } else {
      // Either authorized or on public route
      setIsAuthorized(true);
    }

    // Finish loading after auth check
    setIsLoading(false);
  }, [pathname, router, publicRoutes]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
