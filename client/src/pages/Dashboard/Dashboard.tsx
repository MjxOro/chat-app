import React, { useRef } from "react";
import Chat from "./Chat";
import useSockets from "../../context/SocketContext";
import useAuthenticate from "../../context/AuthContext";

const Dashboard: React.FC = () => {
  const currentUser = useAuthenticate();
  const { socket } = useSockets();
  console.log(currentUser);
  return (
    <>
      {currentUser && (
        <div>
          <Chat />
          <div>{socket.id}</div>
          <div>
            {currentUser.username ? currentUser.username : currentUser.email}
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;
