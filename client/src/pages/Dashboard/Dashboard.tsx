import React, { useRef, useState, useEffect } from "react";
import Chat from "./Chat";
import useSockets from "../../context/SocketContext";
import useAuthenticate from "../../context/AuthContext";
import Rooms from "./Rooms";
import axios from "axios";

const Dashboard: React.FC = () => {
  const currentUser = useAuthenticate();

  return (
    <>
      {currentUser && (
        <div>
          <Rooms currentUser={currentUser} />
          <Chat />
        </div>
      )}
    </>
  );
};
export default Dashboard;
