import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface IMessageModel extends mongoose.Document {
  _senderId: ObjectId;
  _groupId: ObjectId;
  owner: string;
  content: string;
  createdAt: number;
  editAt?: Number;
  _id: ObjectId;
}

const messageSchema = new Schema<IMessageModel>({
  _senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  _groupId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  owner: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Number, default: +new Date() },
  editAt: Number,
});

const Message = model<IMessageModel>("Message", messageSchema);

export default Message;
