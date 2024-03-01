import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";

import {
  sendSuccessResponse,
  sendSuccessResponseBoolean,
  sendSuccessResponseWithStatusCode,
} from "../constants/successResponse";
import validateMongoDBId from "../util/validateMongoDbID";
import commentServices from "../services/comment.services";

const commentsController = {
  // create a new Post

  createComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orchid_slug } = req.body;
      const { user_id, comment } = req.body;

      if (!user_id ) {
        throw generateError("User is invalid input", HttpStatusCodes.BAD_REQUEST);
      }
      if(!comment){
        throw generateError(" Comment Invalid input", HttpStatusCodes.BAD_REQUEST);

      }
      if(!orchid_slug){
        throw generateError("Orchid invalid input", HttpStatusCodes.BAD_REQUEST);
      }
      validateMongoDBId(user_id);
      const newComment = await commentServices.CommentToOrchids({
        orchid_slug,
        user_id,
        comment,
      });

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
  },
  // reply to comment
  replyComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orchid_slug, comment_id } = req.body;
      const { user_id, reply } = req.body;
      validateMongoDBId(user_id);
      if (!user_id || !comment_id || !reply || !orchid_slug) {
        throw generateError("Invalid input", HttpStatusCodes.BAD_REQUEST);
      }
      const newPost = await commentServices.ReplyToComment({
        orchid_slug,
        user_id,
        comment_id,
        reply,
      });

      return sendSuccessResponse(res, HttpStatusCodes.OK, newPost);
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
  // likePost

  likeComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment_id } = req.body;
      const { user_id } = req.body;
      validateMongoDBId(user_id);
      const likeComment = await commentServices.likeComments({
        comment_id,
        user_id,
      });
      return sendSuccessResponse(res, HttpStatusCodes.OK, likeComment);
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

  deleteOwnComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment_id } = req.body;
      const { user_id } = req.body;
      validateMongoDBId(user_id);
      const DeleteComment = await commentServices.deleteOwnComment({
        comment_id,
        user_id,
      });
      return sendSuccessResponse(res, HttpStatusCodes.OK, DeleteComment);
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

  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment_id } = req.params;
      validateMongoDBId(comment_id);
      const DeleteComment = await commentServices.deleteComment(comment_id);
      return sendSuccessResponse(res, HttpStatusCodes.OK, DeleteComment);
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

  getAllComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await commentServices.getAllComments();
      return sendSuccessResponse(res, HttpStatusCodes.OK, comment);
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
  // get all comment in Posts
  getAllCommentInPosts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.body;
      const comment = await commentServices.getAllCommentsInPosts(slug);
      return sendSuccessResponse(res, HttpStatusCodes.OK, comment);
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
};
export default commentsController;
