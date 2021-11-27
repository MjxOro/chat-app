import { useEffect, useRef, useState } from "react";
import useSockets from "../../context/SocketContext";
import EVENTS from "../../config/socketEvents";
import { ScrollControls, Scroll, Html, useScroll } from "@react-three/drei";
import "./Chat.scss";
import { useFrame, useThree } from "@react-three/fiber";

const ChatMessages = ({ messages, setScrollHook }: any) => {
  const data = useScroll();
  //pass hook value to parent component
  //ThreeJs renderer will update scroller height when messages composed
  useFrame(() => {
    setScrollHook(data);
  });

  return (
    <>
      {messages.map((elem: any, index: any) => {
        const position = index * 10;
        return (
          <div
            key={elem._id}
            className="chat__message"
            style={{ position: "absolute", top: `${position}vh` }}
          >
            <div>{elem.content}</div>
            <div>{elem.owner}</div>
          </div>
        );
      })}
    </>
  );
};
const Chat = ({
  isAuth: currentUser,
  socket,
  messages,
  currentRoomId,
}: any) => {
  const newMessageRef: any = useRef();
  const [scrollHook, setScrollHook] = useState<any>(null);
  const setInitScrollY = async () => {
    if (scrollHook) {
      scrollHook.offset = 0.99;
    }
  };
  //Always points to the Latest message: sending or recieving
  useEffect(() => {
    if (scrollHook) {
      setInitScrollY();
    }
  }, [scrollHook]);
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const sentMessage = newMessageRef.current.value || "";
    if (!String(sentMessage).trim() || !currentRoomId) {
      //If message empty nor roomId, dont send
      newMessageRef.current.value = null;
      return;
    }
    console.log(currentRoomId);
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      sentMessage,
      currentUser,
      currentRoomId,
    });
    newMessageRef.current.value = null;
  };
  const { viewport } = useThree();
  console.log(viewport.width, viewport.height);

  return (
    <>
      <ScrollControls
        distance={1}
        damping={5}
        pages={messages.length / 10 || 0}
      >
        <Scroll html>
          <ChatMessages messages={messages} setScrollHook={setScrollHook} />
        </Scroll>
      </ScrollControls>
      <Html position={[viewport.width * 0.01, -viewport.height * 0.4, 0]}>
        <input ref={newMessageRef} placeholder="say something!" />
        <button onClick={handleSendMessage}>Send</button>
      </Html>
    </>
  );
};
export default Chat;
