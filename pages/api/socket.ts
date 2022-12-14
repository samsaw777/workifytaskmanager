import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import messageHandler from "../../utils/Sockets/messageHandler";

export default function ScoketHandler(req: any, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, { pingTimeout: 60000 });
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
    messageHandler(io, socket);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
