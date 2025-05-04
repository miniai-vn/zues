"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

    socketIo.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketIo.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();  
    };
  }, []);

  return { socket, isConnected };
}
