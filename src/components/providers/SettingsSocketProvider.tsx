
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SettingsSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SettingsSocketContext = createContext<SettingsSocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSettingsSocket = () => useContext(SettingsSocketContext);

function normalizeSocketBaseUrl(apiUrl: string): string {
  return apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
}

function getSocketCandidates(): string[] {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  const configuredBaseUrl = normalizeSocketBaseUrl(apiUrl);

  if (typeof window === "undefined") {
    return [configuredBaseUrl];
  }

  return Array.from(new Set([configuredBaseUrl, window.location.origin]));
}

export function SettingsSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const [primaryUrl, fallbackUrl] = getSocketCandidates();
    let activeSocket: Socket | null = null;
    let switchedToFallback = false;

    const connect = (targetUrl: string, allowFallback: boolean) => {
      const instance = io(targetUrl, {
        withCredentials: true,
        transports: ["polling"],
        upgrade: false,
        timeout: 8000,
        reconnectionAttempts: 2,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 2500,
      });

      activeSocket = instance;
      setSocket(instance);

      instance.on("connect", () => {
        setIsConnected(true);
      });

      instance.on("disconnect", () => {
        setIsConnected(false);
      });

      instance.on("connect_error", () => {
        setIsConnected(false);

        if (
          allowFallback &&
          !switchedToFallback &&
          fallbackUrl &&
          fallbackUrl !== targetUrl
        ) {
          switchedToFallback = true;
          instance.removeAllListeners();
          instance.disconnect();
          connect(fallbackUrl, false);
        }
      });
    };

    connect(primaryUrl, true);

    return () => {
      activeSocket?.removeAllListeners();
      activeSocket?.disconnect();
    };
  }, []);

  return (
    <SettingsSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SettingsSocketContext.Provider>
  );
}
