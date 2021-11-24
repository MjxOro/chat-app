import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface IMessageModel extends mongoose.Document {
  _senderID: ObjectId;
  _groupID: ObjectId;
  content: string;
  createdAt: number;
  editAt?: Number;
  _id: ObjectId;
}

const messageSchema = new Schema<IMessageModel>({
  _senderID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  _groupID: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  content: { type: String, required: true },
  createdAt: { type: Number, default: +new Date() },
  editAt: Number,
});

const Message = model<IMessageModel>("Message", messageSchema);

export default Message;
