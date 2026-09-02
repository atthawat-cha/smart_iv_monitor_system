import { io, type Socket } from "socket.io-client";

// Broadcasts consumed here: iv:update, alert:new, device:offline
// (013 Architecture/Application Architecture.md — Socket.IO gateway)
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001");
  }
  return socket;
}
