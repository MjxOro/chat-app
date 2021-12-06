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

const ChatMessages = ({ messages, setScrollHook, currentUser }: any) => {
  const data = useScroll();
  const messageRef: any = useRef([]);
  const { viewport } = useThree();
  const margin = viewport.width * window.innerWidth < 768 ? 0.55 : 0.5;
  //pass hook value to parent component
  //ThreeJs useFram will update scroller height when messages composed
  //Will initially rotate shape infinately
  useFrame(() => {
    setScrollHook(data);
    if (messageRef.current.length !== 0) {
      messageRef.current.forEach((elem: any) => {
        if (!elem) {
          return;
        }
        elem.rotation.y += 0.01;
      });
    }
  });

  //Make shapes more responsive
  return (
    <>
      <group>
        {messages.map((elem: any, index: number) => {
          const position = -index;
          const isMe = (): number => {
            if (elem._senderId === currentUser._id) {
              return viewport.width / 2 - margin;
            } else {
              return window.innerWidth < 768
                ? -(viewport.width / 2 - margin)
                : -(viewport.width / 5 - margin);
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
                position={[isMe() + 0.15, position + 3, -0.5]}
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
                anchorY="top"
                position={[isMe(), position + 3.25, 0]}
              >
                <meshToonMaterial color="black" attach="material" />
                {elem.owner}
              </Text>
              <Text
                anchorX={elem._senderId === currentUser._id ? "right" : "left"}
                anchorY="top"
                color="black"
                position={[isMe(), position + 3, 0]}
                maxWidth={
                  window.innerWidth >= 768
                    ? viewport.width * 0.5
                    : viewport.width * 0.7
                }
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
  showChat,
  setShowChat,
  rooms,
}: any) => {
  const [scrollHook, setScrollHook] = useState<any>(null);
  const [sentMessage, setSentMessage] = useState<string>("");
  const setInitScrollY = async () => {
    if (scrollHook) {
      scrollHook.el.scrollTo(0, scrollHook.el.scrollHeight);
      //scrollHook.offset = 1;
    }
  };
  const currentRoom = rooms.find((elem: any) => {
    return elem._id === currentRoomId;
  });
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
  const handleShowRooms = () => {
    setShowChat(false);
  };
  const { viewport } = useThree();
  console.log(currentRoom);

  return (
    <>
      {currentRoom && (
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
          {window.innerWidth >= 768 ||
            (showChat && (
              <Html
                fullscreen
                style={{
                  display: "flex",
                  height: "5vh",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                <button onClick={handleShowRooms}>Back</button>
                <h1>{currentRoom.title}</h1>
              </Html>
            ))}

          <Html
            style={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: window.innerWidth >= 768 ? "65vw" : "100vw",
              height: "10vh",
            }}
            position={[
              window.innerWidth >= 768
                ? viewport.width * -0.18
                : viewport.width * -0.5,
              -viewport.height * 0.4,
              0,
            ]}
          >
            <TextField
              fullWidth
              id="outlined-multiline-flexible"
              label={null}
              multiline
              minRows={1}
              maxRows={5}
              inputProps={{ maxLength: 200 }}
              value={sentMessage}
              onChange={handleInputChange}
              onKeyPress={handleSendMessage}
              style={{ margin: window.innerWidth >= 768 ? "0" : "0 5vw" }}
            />
          </Html>
        </>
      )}
    </>
  );
};
export default Chat;
