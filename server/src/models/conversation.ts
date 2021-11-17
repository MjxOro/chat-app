import { Schema, model } from "mongoose";

interface IConversationModel {
  _id: Schema.Types.ObjectId;
  group: boolean;
  _ownerID: Schema.Types.ObjectId | null;
  title: string;
  groupPicture: string;
  members: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversationModel>({
  _id: { type: Schema.Types.ObjectId, required: true },
  group: { type: Boolean },
  _ownerID: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  groupPicture: String,
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Date, required: true },
});

const Conversation = model<IConversationModel>(
  "Conversation",
  conversationSchema
);

export default Conversation;
