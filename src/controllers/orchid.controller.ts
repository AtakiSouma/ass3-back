import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import categoriesServices from "../services/categories.services";
import {
  sendSuccessResponse,
  sendSuccessResponseBoolean,
  sendSuccessResponseWithStatusCode,
} from "../constants/successResponse";
import orchidServices, { ICommentsParams } from "../services/orchid.services";
import { Orchids } from "../models/Orchid";
import { ICommentLikeParams } from "../constants/data";

const OrchidsController = {
 
 
  // importOrchids: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const orchids = await orchidsServices.importOrchids();
  //     return sendSuccessResponse(res, HttpStatusCodes.OK, orchids);
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof CustomError) {
  //       next(error);
  //     } else if (error instanceof Error) {
  //       next(error.message);
  //     } else {
  //       next(error);
  //     }
  //   }
  // },
 
 
 
 
 
  createOrchids: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        background,
        category,
        image,
        isNatural,
        origin,
        price,
        rating,
      } = req.body;
      if (
        !name ||
        !background ||
        !image ||
        !origin ||
        !price ||
        !isNatural ||
        !rating ||
        !category
      ) {
        throw generateError("Invalid input data", HttpStatusCodes.BAD_REQUEST);
      }
      const orchid = await orchidServices.createNewOrchids({
        name,
        background,
        category,
        origin,
        price,
        rating,
        image,
        isNatural,
      });
      return sendSuccessResponse(res, HttpStatusCodes.OK, orchid);
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },
  updateOrchid: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        background,
        category,
        image,
        isNatural,
        origin,
        price,
        rating,
        slug,
      } = req.body;
      if (!slug) {
        throw generateError("Invailid Orchid found", HttpStatusCodes.NOT_FOUND);
      }

      const updatedOrchid = await orchidServices.updateOrchidBySlug({
        slug,
        background,
        category,
        image,
        isNatural,
        origin,
        price,
        rating,
        name,
      });
      if (updatedOrchid)
        return sendSuccessResponse(res, HttpStatusCodes.OK, updatedOrchid);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },

 

  getOneOrchid: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {slug } = req.body;
      const OrchidOne = await orchidServices.getOneOrchidsBySlug({slug});

      if (OrchidOne)
        return sendSuccessResponse(res, HttpStatusCodes.OK, OrchidOne);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },

  deleteOrchid: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const response= await orchidServices.DeleteOneOrchidsBySlug({
        slug,
      });
        return sendSuccessResponse(res, HttpStatusCodes.OK , response) 
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },
  getallOrchids: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, limit, page } = req.body;
      const Orchid = await orchidServices.getAllOrchids(
        search,
        page,
        limit
      );
      if (Orchid)
        return sendSuccessResponse(res, HttpStatusCodes.OK, Orchid);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },
  getallOrchidswithoutPaging: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orchid = await Orchids.find().populate("category").populate("comments");
      if (orchid)
        return sendSuccessResponse(res, HttpStatusCodes.OK, orchid);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },
  createNewComment: async  (req: Request, res: Response, next: NextFunction) => {
     const {rating , comment , author ,slug} = <ICommentsParams>req.body;
    try{
      const newComment = await orchidServices.createNewComment(
        {author,comment,slug,rating}
      )
      return sendSuccessResponse(res, HttpStatusCodes.OK, newComment);

    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  }
};

export default OrchidsController;
