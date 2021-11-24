import { useRef } from "react";
import useSockets from "../../context/SocketContext";
import EVENTS from "../../config/socketEvents";

const Chat = ({ currentUser }: { currentUser: object }) => {
  const { socket, messages, currentRoomId } = useSockets();
  const newMessageRef: any = useRef();
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const sentMessage = newMessageRef.current.value || "";
    if (!String(sentMessage).trim()) {
      //If message empty, dont send
      return;
    }
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      sentMessage,
      currentUser,
      currentRoomId,
    });
    newMessageRef.current.value = null;
  };

  return (
    <>
      {messages.map((elem) => {
        return (
          <div>
            <div>{elem.content}</div>
            <div>{elem.owner}</div>
          </div>
        );
      })}
      <input ref={newMessageRef} placeholder="say something!" />
      <button onClick={handleSendMessage}>Send</button>
    </>
  );
};
export default Chat;
