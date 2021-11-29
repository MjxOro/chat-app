import { useEffect, useRef, useState } from "react";
import EVENTS from "../../config/socketEvents";
import { ScrollControls, Scroll, Html, useScroll } from "@react-three/drei";
import "./Chat.scss";
import { useFrame, useThree } from "@react-three/fiber";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { teal } from "@mui/material/colors";

const ChatMessages = ({ messages, setScrollHook, currentUser }: any) => {
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
        let isMe = "0";

        if (elem._senderId !== currentUser._id) {
          isMe = "-40vw";
        } else {
          isMe = "10vw";
        }
        return (
          <div
            key={elem._id}
            className="chat__message"
            style={{ position: "absolute", top: `${position}vh`, left: isMe }}
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
  const [scrollHook, setScrollHook] = useState<any>(null);
  const [sentMessage, setSentMessage] = useState<string>("");
  const setInitScrollY = async () => {
    if (scrollHook) {
      scrollHook.el.scrollTo(0, scrollHook.el.scrollHeight);
      //scrollHook.offset = 1;
    }
  };
  //Always points to the Latest message: sending or recieving
  useEffect(() => {
    setInitScrollY();
    console.log("state Change");
  }, [scrollHook]);
  const handleInputChange = (e: any) => {
    setSentMessage(e.target.value);
  };
  const handleSendMessage = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!String(sentMessage).trim() || !currentRoomId) {
        //If message empty nor roomId, dont send
        setSentMessage("");
        return;
      }
      console.log(currentRoomId);
      socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
        sentMessage,
        currentUser,
        currentRoomId,
      });
      setSentMessage("");
    }
  };
  const { viewport } = useThree();
  console.log(viewport.width, viewport.height);

  return (
    <>
      <ScrollControls
        distance={1}
        damping={100}
        pages={messages.length / 10 || 0}
      >
        <Scroll html>
          <ChatMessages
            messages={messages}
            setScrollHook={setScrollHook}
            currentUser={currentUser}
          />
        </Scroll>
      </ScrollControls>
      <Html
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "65vw",
          height: "10vh",
          backgroundColor: "white",
        }}
        position={[viewport.width * -0.18, -viewport.height * 0.4, 0]}
      >
        <TextField
          fullWidth
          id="outlined-multiline-flexible"
          label={null}
          multiline
          minRows={1}
          maxRows={5}
          value={sentMessage}
          onChange={handleInputChange}
          onKeyPress={handleSendMessage}
          style={{ margin: 0 }}
        />
        <div>OPTIONS1</div>
        <div>OPTIONS2</div>
        <div>OPTIONS3</div>
      </Html>
    </>
  );
};
export default Chat;
