import React, { useRef, useState } from "react";
import "./Rooms.scss";
import useSockets from "../../context/SocketContext";
import EVENTS from "../../config/socketEvents";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { teal } from "@mui/material/colors";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

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
    setShowModal(false);
  };
  const handleJoinRoom = async (e: any) => {
    const clickedRoom = e.target.id;
    if (!clickedRoom) {
      return;
    }
    console.log(clickedRoom);
    socket.emit(EVENTS.CLIENT.JOINING_ROOM, { clickedRoom, currentUser });
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
                style={{ margin: 0 }}
              />
              <Button
                style={{ backgroundColor: teal["A400"] }}
                variant="contained"
                onClick={handleCreateRoom}
              >
                Confirm
              </Button>
            </div>
          </Modal>
          <section>
            <div className="room__wrapper room__add-btn" onClick={handleOpen}>
              <AddIcon
                style={{
                  color: teal["A400"],
                  pointerEvents: "none",
                  fontSize: "3rem",
                }}
                className="room__add-icon"
              />
            </div>
            {rooms.map((elem) => {
              return (
                <div
                  key={elem._id}
                  id={elem._id}
                  className="room__wrapper"
                  onClick={handleJoinRoom}
                >
                  <Avatar
                    sx={{ bgcolor: teal["A400"] }}
                    className="room__avatar"
                  >
                    {elem.title[0]}
                  </Avatar>
                  <p className="room__title">{elem.title}</p>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </>
  );
};
export default Rooms;
