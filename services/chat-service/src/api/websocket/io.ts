import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";

export class SocketIOServer {
  private readonly io: Server;

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, { path: "/ws/" });
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.io.on("connection", (socket) => {
      // console.log("Handshake headers:", socket.handshake.headers);
      console.log("A user connected:", socket.id);

      socket.on("message", (data) => {
        console.log("Message received:", data);
        socket.emit("message", `Server received: ${data}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
}
