import React, { Suspense, useEffect, useState } from "react";
import Chat from "./Chat";
import useAuthenticate from "../../context/AuthContext";
import Rooms from "./Rooms";
import { Canvas } from "@react-three/fiber";
import { Html, Preload } from "@react-three/drei";
import useSockets from "../../context/SocketContext";

const Dashboard: React.FC = () => {
  const { isAuth } = useAuthenticate();
  const { socket, rooms, messages, currentRoomId } = useSockets();
  const [showChat, setShowChat] = useState<boolean>(false);
  const [_, setInnerWidth] = useState<number>(null!);
  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);
  return (
    <>
      <Canvas className="three-chat">
        <ambientLight />
        <pointLight position={[-1, 0, 0]} />
        <Suspense fallback={null}>
          {(window.innerWidth >= 768 || !showChat) && (
            <Html
              style={{
                transform:
                  window.innerWidth >= 768
                    ? "translate(-166%,-50%)"
                    : "translate(-50%,-50%)",
              }}
            >
              <Rooms
                isAuth={isAuth}
                socket={socket}
                rooms={rooms}
                currentRoomId={currentRoomId}
                setShowChat={setShowChat}
              />
            </Html>
          )}
          {(window.innerWidth >= 768 || showChat) && (
            <Chat
              isAuth={isAuth}
              socket={socket}
              messages={messages}
              currentRoomId={currentRoomId}
              setShowChat={setShowChat}
              showChat={showChat}
              rooms={rooms}
            />
          )}
          <Preload />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Dashboard;
