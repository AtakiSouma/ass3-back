import mongoose, { Schema, mongo } from "mongoose";
import { IUsers } from "./Users";
import { IOrchids } from "./Orchid";
export interface IComments {
  comment_text: string;
  customer_id: mongoose.Types.ObjectId | IUsers;
  replyToCommentId: string[];
  customer_id_reply: mongoose.Types.ObjectId[];
  commentLikeCount: number;
  status: boolean | true;
  likes: Map<string | mongoose.Types.ObjectId, boolean>;
  orchid: mongoose.Types.ObjectId | IOrchids;
  rating:number;
}

const CommentsSchema = new Schema<IComments>(
  {
    orchid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Orchids",
    },
    comment_text: {
      type: String,
      required: true,
    },
    replyToCommentId: [
      {
        type: String,
        default: [],
      },
    ],
    customer_id_reply: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    commentLikeCount: {
      type: Number,
      default: 0,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    rating:{
      type:Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export const Comments = mongoose.model<IComments>("Comments", CommentsSchema);
