import { createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
interface ISocketContext {
  socket: Socket;
}
const socket = io("http://localhost:8080");
const SocketContext = createContext<ISocketContext>({
  socket,
});
export const SocketsProvider = (props: any) => {
  return <SocketContext.Provider value={{ socket }} {...props} />;
};

const useSockets = () => useContext(SocketContext);

export default useSockets;
