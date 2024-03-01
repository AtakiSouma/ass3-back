import mongoose, { Schema } from "mongoose";
import { ICategories } from "./Categories";
import { NumberLiteralType } from "typescript";
export interface IOrchids {
  name: string;
  slug: string;
  image: string;
  background: string;
  isNatural: boolean;
  origin: string;
  rating: number;
  category: mongoose.Schema.Types.ObjectId | ICategories;
  price: number;
  comments: any[];
}
const commentSchema = new Schema(
  {
    author_img: { type: String},
    author_name: { type: String},
    rating: { type: Number, min: 1, max: 5, require: true },
    comment: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
  },
  { timestamps: true }
);

const OrchidSchema = new Schema<IOrchids>(
  {
    name: { type: String, required: [true, "Name is required"] },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: [true, "Image is required"] },
    background: { type: String, required: [true, "Background is required"] },
    rating: { type: Number, required: [true, "Rating is required"] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: [true, "Category is required"],
    },
    isNatural: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export const Orchids = mongoose.model<IOrchids>("Orchids", OrchidSchema);
