import { useState } from "react";
import "./Rooms.scss";
import EVENTS from "../../config/socketEvents";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { teal } from "@mui/material/colors";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowBack from "@mui/icons-material/ArrowBackIos";

const Rooms = ({
  isAuth: currentUser,
  socket,
  rooms,
  currentRoomId,
  setShowChat,
}: any) => {
  const [roomName, setRoomName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
  };

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
    setShowChat(true);
  };

  const handleJoinRoom = async (e: any) => {
    const clickedRoom = e.target.id;
    if (!clickedRoom) {
      return;
    }
    socket.emit(EVENTS.CLIENT.LEAVE_ROOMS, { currentRoomId });
    socket.emit(EVENTS.CLIENT.JOINING_ROOM, { clickedRoom, currentUser });
    setShowChat(true);
  };

  return (
    <>
      {rooms && (
        <div>
          <div
            className={showModal ? "modal" : "modal--close"}
            onClick={handleClose}
          >
            <div
              className={showModal ? "modal__box" : "modal--close"}
              style={{ zIndex: 10000 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowBack
                onClick={handleClose}
                className="modal__back-arrow"
                style={{ color: teal["A400"] }}
              />
              <TextField
                id="standard-multiline-flexible"
                label="Room Name"
                multiline
                maxRows={1}
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
          </div>
          <section className="room">
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
            {rooms.map((elem: any) => {
              return (
                <div
                  style={{
                    backgroundColor:
                      elem._id === currentRoomId
                        ? "rgba(29, 233, 182, 0.5)"
                        : "white",
                  }}
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
