import React, { useRef, useState } from "react";
import useSockets from "../../context/SocketContext";
import EVENTS from "../../config/socketEvents";

const NewRoomModal: React.FC = () => {
  return (
    <div>
      <h1>MODAL</h1>
    </div>
  );
};

const Rooms = ({ currentUser }: { currentUser: object }) => {
  const { socket, currentRoomId, rooms } = useSockets();
  const newRoomRef: any = useRef();
  console.log(rooms); //should probably show array of objects
  const handleCreateRoom = (e: any) => {
    e.preventDefault();
    //get roomName
    const roomName = newRoomRef.current.value || "";
    //empty handler
    if (!String(roomName).trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName, currentUser });
    newRoomRef.current.value = null;
  };
  const handleJoinRoom = async () => {
    socket.emit(EVENTS.CLIENT.JOINING_ROOM, { currentRoomId, currentUser });
  };

  return (
    <>
      {rooms && (
        <div>
          <input ref={newRoomRef} placeholder="Enter Room Name here" />
          <button onClick={handleCreateRoom}>Enter</button>
          {rooms.map((elem) => (
            <div>
              <p>{elem.title}</p>
              <p>{`Owner: ${elem.owner}`}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default Rooms;
