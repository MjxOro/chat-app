import { Server, Socket } from "socket.io";
import Room from "./models/rooms";
import Message from "./models/messages";
import mongoose from "mongoose";

export const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    JOINING_ROOM: "JOINING_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    CLIENT_INIT: "CLIENT_INIT",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    SERVER_INIT: "SERVER_INIT",
  },
};

const socket = ({ io }: { io: Server }) => {
  console.log("Sockets enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`user connected ${socket.id}`);

    //Create chat room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, async ({ roomName, currentUser }) => {
      const roomId = String(new mongoose.Types.ObjectId());
      const newRoom = new Room({
        _id: roomId,
        _ownerID: currentUser._id,
        owner: currentUser.username,
        title: roomName,
        members: [currentUser._id],
      });
      await newRoom.save();

      //Grab all chat rooms
      const rooms = await Room.find({});

      socket.join(roomId);
      socket.emit(EVENTS.SERVER.ROOMS, { rooms, roomId });
      console.log("DATA SENT");
      console.log(roomId);
    });

    // Handle User joing chat room
    socket.on(EVENTS.CLIENT.JOINING_ROOM, async ({ currentUser, roomId }) => {
      //add user to Room
      await Room.updateOne(
        { _id: roomId },
        {
          $push: {
            members: currentUser._id,
          },
        }
      );
      socket.join(roomId);
      const getRoomMessage = await Message.find({ _groupId: roomId });
      getRoomMessage.sort((a, b) => a.createdAt - b.createdAt);
      console.log(getRoomMessage);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, getRoomMessage });
    });

    //Handle message sent to a room
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ currentRoomId, sentMessage, currentUser }) => {
        console.log("roomID", currentRoomId);
        console.log("User", currentUser);
        const newMessage = new Message({
          _senderId: currentUser._id,
          _groupId: currentRoomId,
          owner: currentUser.username,
          content: sentMessage,
        });
        await newMessage.save();
        const getRoomMessage = await Message.find({
          _groupId: currentRoomId,
        });
        getRoomMessage.sort((a, b) => a.createdAt - b.createdAt);

        socket.emit(EVENTS.SERVER.ROOM_MESSAGE, { getRoomMessage });
      }
    );
  });
};

export default socket;
