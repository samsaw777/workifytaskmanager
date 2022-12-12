export default (io: any, socket: any) => {
  const dashboardSocket = (user: any) => {
    socket.join(user.id);
    console.log("user joined", user.id);
    socket.emit("Connected User", user.id);
  };

  const createdMessage = (msg: any) => {
    socket.broadcast.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);

  socket.on("setup", dashboardSocket);
};
