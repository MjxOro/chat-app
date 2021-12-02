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
      console.log(roomId);
      console.log(getRoomMessage);
      setCurrentRoomId(roomId);
      if (getRoomMessage) {
        setMessages(getRoomMessage);
      } else {
        setMessages([]);
      }
    });
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ getRoomMessage }) => {
      setMessages(getRoomMessage);
    });
  }, []);

  if (props.canvasProvider) {
    return (
      <SocketContext.Provider
        value={{ socket, currentRoomId, rooms, messages, setMessages }}
      >
        <Canvas>{props.children}</Canvas>
      </SocketContext.Provider>
    );
  }
  return (
    <SocketContext.Provider
      value={{ socket, currentRoomId, rooms, messages, setMessages }}
      {...props}
    />
  );
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
