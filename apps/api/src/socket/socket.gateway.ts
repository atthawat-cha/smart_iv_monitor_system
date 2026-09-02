import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server } from "socket.io";

// Namespace "/", JWT via handshake auth (017 API/API.md).
// Events: iv:update, alert:new, device:offline — broadcast only, no client->server commands in MVP.
@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server!: Server;

  emitIvUpdate(payload: unknown) {
    this.server.emit("iv:update", payload);
  }

  emitAlertNew(payload: unknown) {
    this.server.emit("alert:new", payload);
  }

  emitDeviceOffline(payload: unknown) {
    this.server.emit("device:offline", payload);
  }
}
