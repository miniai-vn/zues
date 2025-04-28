"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenValid, useTokenManager } from '../../hooks/useTokenManager';

interface AuthShieldProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export default function AuthShield({
  children,
  publicRoutes = ["/", "/login", "/register", "/forgot-password", "/forgot-password/reset", "/forgot-password/reset/success"],
}: AuthShieldProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }
  useTokenManager(token, logout);

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicRoute = publicRoutes.includes(pathname);

      if (token) {
        const isValid = isTokenValid(token);

        if (isValid) {
          if (isPublicRoute) {
            router.replace("/dashboard");
            return;
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (!isPublicRoute) {
            router.replace("/login");
            return;
          }
        }
      } else if (!isPublicRoute) {
        router.replace("/login");
        return;
      }

      setShouldRender(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router, publicRoutes]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return shouldRender ? <>{children}</> : null;
}