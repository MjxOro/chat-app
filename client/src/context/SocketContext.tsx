import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import EVENTS from "../config/socketEvents";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
interface ISocketContext {
  socket: Socket;
  currentRoomId?: string;
  rooms: any[];
  messages: any[];
  setMessages: Function;
}
const socket = io(process.env.REACT_APP_HOST as string);
export const SocketContext = createContext<ISocketContext>({
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
    socket.on(EVENTS.SERVER.ROOMS, ({ rooms }) => {
      setRooms(rooms);
    });
    socket.on(EVENTS.SERVER.JOINED_ROOM, ({ roomId, getRoomMessage }) => {
      console.log(getRoomMessage);
      setCurrentRoomId(roomId);
      if (getRoomMessage) {
        setMessages(getRoomMessage);
      } else {
        setMessages([]);
      }
    });
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ getRoomMessage }) => {
      if (!document.hasFocus()) {
        document.title = "New Message....";
      }
      setMessages(getRoomMessage);
      console.log(messages);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, currentRoomId, rooms, messages, setMessages }}
      {...props}
    />
  );
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
