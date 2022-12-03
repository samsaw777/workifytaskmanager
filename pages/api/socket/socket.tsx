import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export default function ScoketHandler(req: NextApiRequest, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
    const createdMessage = (msg: any) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    };

    socket.on("createdMessage", createdMessage);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
