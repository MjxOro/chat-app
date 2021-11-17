import { Schema, model } from "mongoose";

interface MessageModel {
  _id: Schema.Types.ObjectId;
  _senderID: Schema.Types.ObjectId;
  _groupID: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  editAt: Date | null;
}

const messageSchema = new Schema<MessageModel>({
  _id: { type: Schema.Types.ObjectId, required: true },
  _senderID: { Types: Schema.Types.ObjectId, required: true, ref: "User" },
  _groupID: { Types: Schema.Types.ObjectId, required: true, ref: "Group" },
  content: { type: String, default: "" },
  createdAt: { type: Date, required: true },
  editAt: Date,
});

const Message = model<MessageModel>("Message", messageSchema);

export default Message;