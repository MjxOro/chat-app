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
      });
      await newRoom.save();

      //Grab all chat rooms
      const rooms = await Room.find({});

      socket.join(roomId);

      socket.broadcast.emit(EVENTS.SERVER.ROOMS, { rooms });
      socket.emit(EVENTS.SERVER.ROOMS, { rooms });
      socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId });

      console.log("DATA SENT");
      console.log(roomId);
    });

    // Handle User joing chat room
    socket.on(
      EVENTS.CLIENT.JOINING_ROOM,
      async ({ clickedRoom, currentUser }) => {
        //add user to Room
        console.log(clickedRoom);
        socket.join(clickedRoom);
        const getRoomMessage = await Message.find({ _groupId: clickedRoom });
        getRoomMessage.sort((a, b) => a.createdAt - b.createdAt);
        const roomId = clickedRoom;
        socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, getRoomMessage });
      }
    );

    //Handle message sent to a room
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ currentRoomId, sentMessage, currentUser }) => {
        socket.join(currentRoomId);
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

        //SEEN both sender and reciever
        socket.nsp
          .to(currentRoomId)
          .emit(EVENTS.SERVER.ROOM_MESSAGE, { getRoomMessage });
      }
    );
  });
};

export default socket;
