import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";

const io = new Server();

export const engine = new Engine();

io.bind(engine);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    socket.emit("message", `Server received: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
