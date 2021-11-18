import React, { useRef } from "react";
import Chat from "./Chat";
import useUser from "../../context/UserContext";
import useSockets from "../../context/SocketContext";

const Dashboard: React.FC = () => {
  const currentUser = useUser();
  const { socket } = useSockets();
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
