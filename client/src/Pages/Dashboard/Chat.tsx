import { useEffect, useRef, useState } from "react";
import EVENTS from "../../config/socketEvents";
import {
  ScrollControls,
  Scroll,
  Html,
  useScroll,
  Text,
} from "@react-three/drei";
import "./Chat.scss";
import { useFrame, useThree } from "@react-three/fiber";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { teal } from "@mui/material/colors";

const ChatMessages = ({
  messages,
  setScrollHook,
  currentroomId,
  currentUser,
  viewport,
}: any) => {
  const data = useScroll();
  const { camera } = useThree();
  const messageRef: any = useRef([]);
  //pass hook value to parent component
  //ThreeJs renderer will update scroller height when messages composed
  useFrame(() => {
    setScrollHook(data);
  });
  useEffect(() => {
    return window.removeEventListener("mousemove", handleMouseMove);
  }, [currentroomId]);
  const handleMouseMove = (e: any) => {
    const cursorX = e.clientX / window.innerWidth - 1;
    const cursorY = -((e.clientY * 0.25) / window.innerHeight - 2);
    if (messageRef.current[messages.length - 1]) {
      messages.forEach((elem: any, index: number) => {
        if (elem._senderId === currentUser._id) {
          messageRef.current[index].position.y = -cursorY;
          messageRef.current[index].rotation.y = cursorX / 5;
        } else {
          messageRef.current[index].position.y = -cursorY;
          messageRef.current[index].rotation.y = -cursorX / 5;
        }
      });
    }
  };
  window.addEventListener("mousemove", handleMouseMove);

  return (
    <>
      {messages.map((elem: any, index: number) => {
        const position = -index;
        const isMe = (): number => {
          if (elem._senderId === currentUser._id) {
            return 5;
          } else {
            return -1.75;
          }
        };

        return (
          <group
            ref={(el) => {
              messageRef.current[index] = el;
            }}
            key={elem._id}
            position={[isMe(), -2, 0]}
          >
            <Text
              anchorX={elem._senderId === currentUser._id ? "right" : "left"}
              color="black"
              position={[0, position + 3.25, 0]}
            >
              {elem.owner}
            </Text>
            <Text
              anchorX={elem._senderId === currentUser._id ? "right" : "left"}
              color="black"
              position={[0, position + 3, 0]}
            >
              {elem.content}
            </Text>
          </group>
          /*
          <div
            key={elem._id}
            className="chat__message"
            style={{ position: "absolute", top: `${position}vh`, left: isMe }}
          >
            <div>{elem.content}</div>
            <div>{elem.owner}</div>
          </div>
          */
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
      socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
        sentMessage,
        currentUser,
        currentRoomId,
      });
      console.log(messages);
      setSentMessage("");
    }
  };
  const { viewport } = useThree();

  return (
    <>
      <ScrollControls
        distance={1}
        damping={100}
        pages={(messages.length + 3) / viewport.height || 0}
      >
        <Scroll>
          <ChatMessages
            messages={messages}
            setScrollHook={setScrollHook}
            currentUser={currentUser}
            currentroomId={currentRoomId}
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
