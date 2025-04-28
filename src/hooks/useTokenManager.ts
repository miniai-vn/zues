import { jwtDecode } from "jwt-decode"
import { useEffect, useRef } from "react";

interface JwtPayload {
  exp: number
  [key: string]: any
}
  
export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}

export function useTokenManager(token: string | null, onLogout: () => void) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) {
        throw new Error("Token không có exp");
      }

      const currentTime = Date.now() / 1000;
      const expiresIn = decoded.exp - currentTime;
      console.log("Token sẽ hết hạn sau:", expiresIn, "giây");

      if (expiresIn <= 0) {
        onLogout();
      } else {
        timeoutRef.current = setTimeout(() => {
          onLogout();
        }, expiresIn * 1000);
      }
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      onLogout();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [token, onLogout]);
}
  
  