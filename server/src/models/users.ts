import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface IUserModel extends mongoose.Document {
  googleId?: string;
  email: string;
  username?: string;
  picture?: string;
  banned: boolean;
  createdAt: number;
  _id: ObjectId;
}

const userSchema = new Schema<IUserModel>({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  picture: String,
  banned: { type: Boolean, default: false },
  createdAt: { type: Number, default: +new Date() },
});

const User = model<IUserModel>("User", userSchema);

export default User;
