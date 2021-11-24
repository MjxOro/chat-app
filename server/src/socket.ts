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
      const roomId = new mongoose.Types.ObjectId();
      const newRoom = new Room({
        _id: roomId,
        _ownerID: currentUser._id,
        owner: currentUser.username,
        title: roomName,
        members: [currentUser._id],
      });
      await newRoom.save();

      socket.join(String(roomId));

      //Grab all chat rooms
      const rooms = await Room.find({});

      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      console.log("DATA SENT");
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
      socket.join(String(roomId));
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
    //Handle message sent to a room
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ roomId, message, currentUser }) => {
        const newMessage = new Message({
          _senderID: currentUser._id,
          _groupID: roomId,
          content: message,
        });
        await newMessage.save();
        socket.to(String(roomId)).emit(EVENTS.SERVER.ROOM_MESSAGE);
      }
    );
  });
};

export default socket;
