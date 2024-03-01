import mongoose, { Schema } from "mongoose";
export interface IUsers {
  username: string;
  email: string;
  password: string;
  avatar: string;
  phoneNumber: number;
  gender: boolean;
  isAdmin: boolean;
  status: boolean;
  isBlocked?: boolean;
}

const UsersSchema = new Schema<IUsers>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.donmai.us/original/fe/90/fe90c2ad3c46efd002abe86229bcdc37.png",
    },
    phoneNumber: {
      type: Number,
      default: 0,
    },
    gender: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Users = mongoose.model<IUsers>("Users", UsersSchema);
