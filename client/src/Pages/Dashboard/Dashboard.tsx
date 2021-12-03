import React, { useContext, Suspense, useState } from "react";
import Chat from "./Chat";
import useAuthenticate, {
  AuthContext,
  AuthProvider,
} from "../../context/AuthContext";
import Rooms from "./Rooms";
import { Canvas } from "@react-three/fiber";
import { Html, Preload } from "@react-three/drei";
import useSockets from "../../context/SocketContext";

const Dashboard: React.FC = () => {
  const { isAuth } = useAuthenticate();
  const { socket, rooms, messages, currentRoomId } = useSockets();
  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[-1, 0, 0]} />
        <Suspense fallback={null}>
          <Html style={{ transform: "translate(-166%,-50%)" }}>
            <Rooms
              isAuth={isAuth}
              socket={socket}
              rooms={rooms}
              currentRoomId={currentRoomId}
            />
          </Html>
          <Chat
            isAuth={isAuth}
            socket={socket}
            messages={messages}
            currentRoomId={currentRoomId}
          />
          <Preload />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Dashboard;
