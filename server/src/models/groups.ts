import { Schema, model } from "mongoose";

interface GroupModel {
  _id: Schema.Types.ObjectId;
  directMessage: boolean;
  _ownerID: Schema.Types.ObjectId | null;
  title: string;
  groupPicture: string;
  members: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const groupSchema = new Schema<GroupModel>({
  _id: { type: Schema.Types.ObjectId, required: true },
  directMessage: { type: Boolean, required: true },
  _ownerID: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  groupPicture: String,
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Date, required: true },
});

const Group = model<GroupModel>("Group", groupSchema);

export default Group;
