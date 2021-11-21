import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";
interface ISocketContext {
  socket: Socket;
  roomId?: string;
  rooms: object;
}
const socket = io("http://localhost:8080");
const SocketContext = createContext<ISocketContext>({
  socket,
  rooms: {},
});
export const SocketsProvider = (props: any) => {
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  return (
    <SocketContext.Provider value={{ socket, roomId, rooms }} {...props} />
  );
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
