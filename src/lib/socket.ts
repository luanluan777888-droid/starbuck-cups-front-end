import { io, Socket } from "socket.io-client";
import { NotificationPayload } from "@/types/notification.types";

interface ServerToClientEvents {
  "notification:new": (notification: NotificationPayload) => void;
  "notification:count_update": (count: number) => void;
  "consultation:created": (data: NotificationPayload) => void;
  "order:created": (data: NotificationPayload) => void;
  "notification:consultation": (data: NotificationPayload) => void;
  "notification:order": (data: NotificationPayload) => void;
  "admin:joined": () => void;
  error: (error: string) => void;
}

interface ClientToServerEvents {
  "admin:join": () => void;
  "admin:leave": () => void;
  "notification:mark_read": (notificationId: string) => void;
}

class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private isConnecting = false;

  private normalizeSocketBaseUrl(apiUrl: string): string {
    return apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
  }

  private getSocketCandidates(): string[] {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL
      ? this.normalizeSocketBaseUrl(process.env.NEXT_PUBLIC_API_URL)
      : "http://localhost:8080";

    if (typeof window === "undefined") {
      return [configuredUrl];
    }

    return Array.from(new Set([window.location.origin, configuredUrl]));
  }

  public connect(
    token: string
  ): Promise<Socket<ServerToClientEvents, ClientToServerEvents>> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve(this.socket);
          } else if (!this.isConnecting) {
            reject(new Error("Connection failed"));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;
      const candidates = this.getSocketCandidates();
      let candidateIndex = 0;
      let settled = false;

      const cleanupCurrentSocket = () => {
        if (!this.socket) return;
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      };

      const tryConnect = (serverUrl: string) => {
        this.socket = io(serverUrl, {
          auth: {
            token,
          },
          transports: ["websocket", "polling"],
          timeout: 8000,
          reconnection: false,
        });

        this.socket.on("connect", () => {
          if (settled) return;
          settled = true;
          this.isConnecting = false;
          this.socket?.emit("admin:join");
          resolve(this.socket!);
        });

        this.socket.on("disconnect", () => {
          this.isConnecting = false;
        });

        this.socket.on("connect_error", (error: Error) => {
          cleanupCurrentSocket();
          candidateIndex += 1;

          if (candidateIndex < candidates.length) {
            tryConnect(candidates[candidateIndex]);
            return;
          }

          if (!settled) {
            settled = true;
            this.isConnecting = false;
            reject(error);
          }
        });
      };

      tryConnect(candidates[candidateIndex]);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.emit("admin:leave");
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  public getSocket(): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public markNotificationAsRead(notificationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("notification:mark_read", notificationId);
    }
  }

  public joinAdminRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit("admin:join");
    }
  }

  public leaveAdminRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit("admin:leave");
    }
  }
}

// Export singleton instance
export const socketManager = new SocketManager();
