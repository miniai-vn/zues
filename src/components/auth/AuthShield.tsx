"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthShieldProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export default function AuthShield({
  children,
  publicRoutes = ["/login", "/register", "/forgot-password", "/"],
}: AuthShieldProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) { 
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }

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
