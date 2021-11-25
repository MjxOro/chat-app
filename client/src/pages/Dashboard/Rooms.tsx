import React, { useRef, useState } from "react";
import useSockets from "../../context/SocketContext";
import EVENTS from "../../config/socketEvents";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { teal } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const Rooms = ({ currentUser }: { currentUser: any }) => {
  const { socket, currentRoomId, rooms } = useSockets();
  const [roomName, setRoomName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleTextFieldChange = (e: any) => {
    setRoomName(e.target.value);
  };
  const handleCreateRoom = (e: any) => {
    e.preventDefault();
    console.log(roomName);
    if (!roomName.trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName, currentUser });
    setRoomName("");
  };
  const handleJoinRoom = async () => {
    socket.emit(EVENTS.CLIENT.JOINING_ROOM, { currentRoomId, currentUser });
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      {rooms && (
        <div>
          <Modal open={showModal} onClose={handleClose}>
            <div className="modal">
              <TextField
                id="standard-multiline-flexible"
                label="Room Name"
                multiline
                maxRows={4}
                value={roomName}
                onChange={handleTextFieldChange}
                variant="standard"
              />
              <button onClick={handleCreateRoom}>Enter</button>
            </div>
          </Modal>
          <div className="room_add-btn" onClick={handleOpen}>
            ADD ROOM
          </div>
          {rooms.map((elem) => (
            <div
              key={elem._id}
              onClick={handleJoinRoom}
              className="room__wrapper"
            >
              <Avatar sx={{ bgcolor: teal["A400"] }}>{elem.title[0]}</Avatar>
              <p className="room__title">{elem.title}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default Rooms;
