import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface IRoomModel extends mongoose.Document {
  _id: ObjectId;
  _ownerID: ObjectId;
  owner: string;
  title: string;
  groupPicture?: string;
  createdAt?: number;
}

const roomSchema = new Schema<IRoomModel>({
  _id: { type: Schema.Types.ObjectId, required: true },
  _ownerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  groupPicture: { type: String, default: "" },
  createdAt: { type: Number, default: +new Date() },
});

const Room = model<IRoomModel>("Room", roomSchema);

export default Room;
