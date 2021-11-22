import { Schema, model } from "mongoose";

export interface IConversationModel {
  _id: string;
  _ownerID: Schema.Types.ObjectId | null;
  title: string;
  groupPicture?: string;
  members: Array<Schema.Types.ObjectId>;
  createdAt?: number;
}

const conversationSchema = new Schema<IConversationModel>({
  _id: { type: String, required: true },
  _ownerID: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  groupPicture: { type: String, default: "" },
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Number, default: +new Date() },
});

const Conversation = model<IConversationModel>(
  "Conversation",
  conversationSchema
);

export default Conversation;
