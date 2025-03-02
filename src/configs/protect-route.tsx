// components/ProtectedRoute.tsx
import { useUserStore } from "@/hooks/data/useAuth";
import { ReactNode, useEffect, useState } from "react";

export enum Role {
  Manager = "manager",
  Staff = "staff",
}

interface ProtectedRouteProps {
  children: ReactNode; // This allows any valid JSX to be passed as children
  requiredRole: string[]; // Specify the required role as an array of strings
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, setUser } = useUserStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setIsRedirecting(true);
      }
    } else if (!requiredRole.includes(user.role)) {
      setIsRedirecting(true);
    }
  }, [user, requiredRole, setUser]);

  if (isRedirecting) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
