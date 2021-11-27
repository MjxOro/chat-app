import React, { useContext } from "react";
import Chat from "./Chat";
import useAuthenticate, {
  AuthContext,
  AuthProvider,
} from "../../context/AuthContext";
import Rooms from "./Rooms";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import useSockets from "../../context/SocketContext";

const Dashboard: React.FC = () => {
  const { isAuth } = useAuthenticate();
  const { socket, rooms, messages, currentRoomId } = useSockets();
  return (
    <>
      <Canvas>
        <Html style={{ transform: "translate(-166%,-50%)" }}>
          <Rooms isAuth={isAuth} socket={socket} rooms={rooms} />
        </Html>
        <Chat
          isAuth={isAuth}
          socket={socket}
          messages={messages}
          currentRoomId={currentRoomId}
        />
      </Canvas>
    </>
  );
};
export default Dashboard;
