import { StringLiteral } from "typescript";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { generateError } from "../libs/handlers/errorsHandlers";
import { Categories, ICategories } from "../models/Categories";
import { Orchids } from "../models/Orchid";
import GenerateSlug from "../util/GenerateSlug";
import mongoose from "mongoose";
import { Users } from "../models/Users";
export interface ICommentsParams {
  author: string;
  rating: string;
  comment: string;
  slug: string;
}
interface IdParams {
  id: string;
}
interface SlugParams {
  slug: string;
}
interface IOrchidsParams {
  name: string;
  image: string;
  background: string;
  rating: number;
  category: mongoose.Schema.Types.ObjectId | ICategories;
  isNatural: boolean;
  origin: string;
  price: number;
}
interface IUpdateOrchidsParams {
  name: string;
  slug: string;
  image: string;
  background: string;
  rating: number;
  category: mongoose.Schema.Types.ObjectId | ICategories;
  isNatural: boolean;
  origin: string;
  price: number;
}
interface IUpdateCategoriesBySlug {
  slug: string;
  name: string;
  description: string;
}

class OrchidsServices {
  public async createNewOrchids({
    name,
    background,
    category,
    image,
    isNatural,
    origin,
    price,
    rating,
  }: IOrchidsParams) {
    const existOrchid = await Orchids.findOne({
      slug: GenerateSlug(name),
    });
    if (existOrchid) {
      throw generateError("Orchid already exists !", HttpStatusCodes.CONFLICT);
    }
    const newOrchids = await Orchids.create({
      name: name,
      slug: GenerateSlug(name),
      background: background,
      category: category,
      image: image,
      isNatural: isNatural,
      origin: origin,
      price: price,
      rating: rating,
    });
    return newOrchids;
  }

  public async updateOrchidBySlug({
    slug,
    name,
    background,
    category,
    image,
    isNatural,
    origin,
    price,
    rating,
  }: IUpdateOrchidsParams) {
    const existOrchid = await Orchids.findOne({
      slug: slug,
    });
    if (existOrchid) {
      existOrchid.name = name || existOrchid.name;
      existOrchid.category = category || existOrchid.category;
      existOrchid.image = image || existOrchid.image;
      existOrchid.background = background || existOrchid.background;
      existOrchid.rating = rating || existOrchid.rating;
      existOrchid.origin = origin || existOrchid.origin;
      existOrchid.isNatural = isNatural || existOrchid.isNatural;
      existOrchid.price = price || existOrchid.price;
    } else {
      throw generateError(
        `Cannot find orchid ${slug}`,
        HttpStatusCodes.NOT_FOUND
      );
    }
    const updatedOrchids = await existOrchid?.save();
    return updatedOrchids;
  }

  public async getOneOrchidsBySlug({ slug }: SlugParams) {
    const existOrchids = await Orchids.findOne({
      slug: slug,
    }).populate("category").populate("comments");
    if (!existOrchids) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    return existOrchids;
  }

  public async DeleteOneOrchidsBySlug({ slug }: SlugParams) {
    const existOrchids = await Orchids.findOne({
      slug: slug,
    });
    if (!existOrchids) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    await Orchids.findOneAndDelete({
      slug: slug,
    });
    return {
      response: "Orchid successfully deleted",
    };
  }

  public async getAllOrchids(search: string, page: number, limit: number) {
    try {
      const query = {
        name: { $regex: new RegExp(search, "i") },
      };
      const orchidList = await Orchids.find(query)
        .sort({ create_at: "desc" })
        .populate({
          path: "category",
          select: "name slug",
        })
        .populate("comments")
        .skip((page - 1) * limit)
        .limit(limit);

      const totalCount = await Orchids.countDocuments(query);
      const data = orchidList.map((orchid) => ({
        id: orchid._id,
        name: orchid.name,
        slug: orchid.slug,
        isNatural: orchid.isNatural,
        origin: orchid.origin,
        image: orchid.image,
        background: orchid.background,
        category: orchid.category,
        rating: orchid.rating,
        price: orchid.price,
        comments:orchid.comments
      }));
      const response = {
        data,
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
      };
      return response;
    } catch (error) {
      console.log(error);
      throw generateError("Cannot get orchid!", HttpStatusCodes.BAD_REQUEST);
    }
  }

  public async createNewComment({
    author,
    comment,
    rating,
    slug,
  }: ICommentsParams) {
    const user = await Users.findById(author);
    if(!user){
      throw generateError(
        "User not found",
        HttpStatusCodes.BAD_REQUEST
      );
    }
    const orchids = await Orchids.findOne({ slug: slug });
    if (orchids) {
      const alreadyComment = orchids.comments.find(
        (r) => r.author.toString() === author.toString()
      );
      if (alreadyComment) {
        throw generateError(
          "Cannot create new comment! You already comment to this Orchids!",
          HttpStatusCodes.BAD_REQUEST
        );
      } else {
        const newComment = {
          author: user._id,
          author_img: user.avatar,
          author_name: user.username,
          comment: comment,
          rating: Number(rating),
        };
        orchids.comments.push(newComment);
        await orchids.save();
        const response = {
          repsonse: "Comment Sucessfully",
          orchid: orchids,
          newComent: newComment,
        };
        return response;
      }
    } else {
      throw generateError("Cannot find orchid!", HttpStatusCodes.NOT_FOUND);
    }
  }
}
export default new OrchidsServices();
