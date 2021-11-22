import React, { useEffect, useState } from "react";
import useSockets from "../../context/SocketContext";
import axios from "axios";
import { EVENTS } from "../../../../server/src/socket";
const Conversation = ({ currentUser }: { currentUser: object }) => {
  const [convoList, setConvoList] = useState(null);
  const getConvoList = async () => {
    const res = await axios.get("/api/getConvoList");
    if (!res.data) {
      return null;
    }
    setConvoList(res.data);
  };
  useEffect(() => {
    getConvoList();
  }, []);
  const { socket, roomId, rooms } = useSockets();
  const handleCreateRoom = async () => {
    //get roomName
    const roomName = newRoomRef.current.value || "";
    //empty handler
    if (!String(roomName).trim()) {
      return;
    }
    //room create event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName, currentUser });
  };
  const handleJoinRoom = async () => {
    socket.emit(EVENTS.CLIENT.JOINING_ROOM, { roomId, currentUser });
  };

  return (
    <>
      <div>
        <h1>BRO</h1>
      </div>
    </>
  );
};
export default Conversation;
