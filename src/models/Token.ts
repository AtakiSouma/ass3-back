import mongoose, { Schema, model } from "mongoose";
import { IUsers } from "./Users";

export interface IRefreshTokens {
  user: mongoose.Types.ObjectId | IUsers;
  refresh_token: string;
}
const tokenSchema = new Schema<IRefreshTokens>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    refresh_token: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
export const Tokens = mongoose.model<IRefreshTokens>("Tokens", tokenSchema);

