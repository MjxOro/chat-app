import { useEffect, useRef, useState } from "react";
import EVENTS from "../../config/socketEvents";
import {
  ScrollControls,
  Scroll,
  Html,
  useScroll,
  Text,
  RoundedBox,
} from "@react-three/drei";
import "./Chat.scss";
import { useFrame, useThree } from "@react-three/fiber";
import TextField from "@mui/material/TextField";

const ChatMessages = ({
  messages,
  setScrollHook,
  currentroomId,
  currentUser,
}: any) => {
  const data = useScroll();
  const messageRef: any = useRef([]);
  //pass hook value to parent component
  //ThreeJs renderer will update scroller height when messages composed
  const handleMouseMove = (e: any) => {
    const cursorX = e.clientX / window.innerWidth - 1;
    const cursorY = -((e.clientY * 0.25) / window.innerHeight - 2);
  };
  window.addEventListener("mousemove", handleMouseMove);
  useFrame(() => {
    setScrollHook(data);
    if (messageRef.current.length) {
      messages.forEach((elem: any, index: number) => {
        messageRef.current[index].rotation.y += 0.01;
      });
    }
  });
  useEffect(() => {
    return window.removeEventListener("mousemove", handleMouseMove);
  }, [currentroomId]);

  return (
    <>
      <group>
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
            <>
              <RoundedBox
                ref={(el) => {
                  messageRef.current[index] = el;
                }}
                key={elem._id}
                args={[0.25, 0.5, 0.1]}
                radius={0.1}
                smoothness={2}
                position={[isMe() + 0.15, position + 3, -0.2]}
              >
                <meshToonMaterial
                  color={
                    elem._senderId === currentUser._id ? "#1de9b6" : "pink"
                  }
                  attach="material"
                />
              </RoundedBox>
              <Text
                anchorX={elem._senderId === currentUser._id ? "right" : "left"}
                position={[isMe(), position + 3.25, 0]}
              >
                <meshToonMaterial color="black" attach="material" />
                {elem.owner}
              </Text>
              <Text
                anchorX={elem._senderId === currentUser._id ? "right" : "left"}
                color="black"
                position={[isMe(), position + 3, 0]}
              >
                <meshToonMaterial color="black" attach="material" />
                {elem.content}
              </Text>
            </>
          );
        })}
      </group>
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
        eps={1}
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
