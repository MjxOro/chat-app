import { createContext, useContext } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
const SocketContext = createContext<any>({ socket });
export const SocketsProvider = (props: any) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {...props}
    </SocketContext.Provider>
  );
};

const useSockets = () => {
  useContext(SocketContext);
};
export default useSockets;
