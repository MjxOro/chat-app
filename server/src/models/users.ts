import mongoose, { Schema, model } from "mongoose";

export interface IUserModel extends mongoose.Document {
  googleId?: string;
  twitterId?: string;
  email: string;
  username?: string;
  picture?: string;
  groups?: Array<Schema.Types.ObjectId | null>;
  banned: boolean;
  createdAt: number;
  _id: string;
}

const userSchema = new Schema<IUserModel>({
  googleId: { type: String, unique: true },
  twitterId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  picture: String,
  groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  banned: { type: Boolean, default: false },
  createdAt: { type: Number, default: +new Date() },
});

export const User = model<IUserModel>("User", userSchema);
