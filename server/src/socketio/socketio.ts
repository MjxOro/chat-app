import io from "socket.io";

io.on("connection", (socket) => {
  console.log("Hello from the server!");
});

export default io;
