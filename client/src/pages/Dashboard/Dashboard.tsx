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
  const { socket, rooms } = useSockets();
  return (
    <>
      <Canvas>
        <Html center>
          <Rooms isAuth={isAuth} socket={socket} rooms={rooms} />
        </Html>
      </Canvas>
    </>
  );
};
export default Dashboard;
