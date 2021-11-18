import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
};
let users = [];

const socket = ({ io }: { io: Server }) => {
  console.log("Scokets enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`use connected ${socket.id}`);
  });
};

export default socket;
