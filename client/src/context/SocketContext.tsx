import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import EVENTS from "../config/socketEvents";
import axios from "axios";
interface ISocketContext {
  socket: Socket;
  roomId?: string;
  rooms: any[];
  messages?: any[];
  setMessages: Function;
}
const socket = io("http://localhost:8080");
const SocketContext = createContext<ISocketContext>({
  socket,
  rooms: [],
  messages: [],
  setMessages: () => false,
});
export const SocketsProvider = (props: any) => {
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState<any[]>([]);
  const getRooms = async () => {
    const res = await axios.get("/api/getRooms");
    setRooms(res.data);
  };
  useEffect(() => {
    getRooms();
    socket.on(EVENTS.SERVER.ROOMS, (value) => {
      setRooms(value);
    });
    socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
      setRoomId(value);
      setMessages({});
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, roomId, rooms, messages, setMessages }}
      {...props}
    />
  );
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
