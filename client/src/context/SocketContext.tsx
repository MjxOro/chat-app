import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import EVENTS from "../config/socketEvents";
import axios from "axios";
interface ISocketContext {
  socket: Socket;
  currentRoomId?: string;
  rooms: any[];
  messages: any[];
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
  const [currentRoomId, setCurrentRoomId] = useState<any>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const getRooms = async () => {
    const res = await axios.get("/api/getRooms");
    setRooms(res.data);
  };
  useEffect(() => {
    getRooms();
    socket.on(EVENTS.SERVER.ROOMS, ({ rooms, roomId }) => {
      setCurrentRoomId(roomId);
      setRooms(rooms);
      console.log(roomId);
    });
    socket.on(EVENTS.SERVER.JOINED_ROOM, ({ roomId, getRoomMessage }) => {
      console.log(roomId);
      console.log(getRoomMessage);
      setCurrentRoomId(roomId);
      setMessages(getRoomMessage);
    });
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ getRoomMessage }) => {
      console.log("I SENT");
      setMessages(getRoomMessage);
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, currentRoomId, rooms, messages, setMessages }}
      {...props}
    />
  );
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
