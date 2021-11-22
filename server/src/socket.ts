import { Server, Socket } from "socket.io";
import Conversation, { IConversationModel } from "./models/conversation";
import { nanoid } from "nanoid";

export const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    JOINING_ROOM: "JOINING_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
  },
};

const socket = ({ io }: { io: Server }) => {
  console.log("Scokets enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`use connected ${socket.id}`);
    //Create chat room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, async ({ roomName, currentUser }) => {
      console.log({ roomName });

      const roomId = nanoid();
      const conversationData: IConversationModel = {
        _id: roomId,
        _ownerID: currentUser,
        title: roomName,
        members: [currentUser],
      };
      new Conversation(conversationData);

      socket.join(roomId);

      const rooms = await Conversation.find({});

      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
    });

    // Handle User joing chat room
    socket.on(EVENTS.CLIENT.JOINING_ROOM, async ({ currentUser, roomId }) => {
      //add user to conversation
      await Conversation.updateOne(
        { _id: roomId },
        {
          $push: {
            members: currentUser._id,
          },
        }
      );
      socket.join(roomId);
      socket.emit(EVENTS.CLIENT.JOINED_ROOM, roomId);
    });
    //Handle joined users in chat room
  });
};

export default socket;
