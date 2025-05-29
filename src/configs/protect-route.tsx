// components/ProtectedRoute.tsx
import { useUserStore } from "@/hooks/data/useAuth";
import { ReactNode, useEffect, useState } from "react";
import { Role as RoleModel } from "@/hooks/data/useRoles";

export enum Role {
  Admin = "admin",
  Manager = "manager",
  Staff = "staff",
  Leader = "leader"
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
    } else if (
      !user.roles.some((role: RoleModel) => requiredRole.includes(role.name))
    ) {
      setIsRedirecting(true);
    }
  }, [user, requiredRole, setUser]);

  if (isRedirecting) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
