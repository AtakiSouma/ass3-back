import mongoose from "mongoose";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import {
  ICommentLikeParams,
  ICommentParams,
  ICommentToCreatorProfileParams,
  IDeleteCommentParams,
  ILikePostsParams,
  IReplyParams,
  IReplyParamsToCreatorProfile,
} from "../constants/data";
import { generateError } from "../libs/handlers/errorsHandlers";

import { Users } from "../models/Users";
import { Comments } from "../models/Comments";
import { Orchids } from "../models/Orchid";
class commentServices {
  ////// ************

  /// ************ POSTS

  public async CommentToOrchids({
    comment,
    orchid_slug,
    user_id,
  }: ICommentParams) {
    const user = await Users.findById(user_id);
    const orchid = await Orchids.findOne({ slug: orchid_slug });
    if (!user) {
      throw generateError("User not found", HttpStatusCodes.NOT_FOUND);
    }
    if (!orchid) {
      throw generateError("Orchids not found", HttpStatusCodes.NOT_FOUND);
    }
    const new_Comment = await Comments.create({
      comment_text: comment,
      customer_id: user_id,
      orchid: orchid._id,
      commentLikeCount: 0,
      likes: {},
      replyToCommentId: [],
      customer_id_reply: [],
      status: true,
    });
    return new_Comment;
  }

  // reply to a comment
  public async ReplyToComment({
    reply,
    orchid_slug,
    user_id,
    comment_id,
  }: IReplyParams) {
    const user = await Users.findById(user_id);
    const orchid = await Orchids.findOne({ slug: orchid_slug });
    if (!user) {
      throw generateError("User not found", HttpStatusCodes.NOT_FOUND);
    }
    if (!orchid) {
      throw generateError("Orchid not found", HttpStatusCodes.NOT_FOUND);
    }
    const comment = await Comments.findById(comment_id);
    if (comment) {
      const newReply = {
        reply,
        customer_id_reply: user._id,
        orchid_id: orchid.id,
        orchid_name: orchid.name,
      };
      // Push
      comment.replyToCommentId.push(reply);
      comment.customer_id_reply.push(user._id);
      await comment.save();
      //
      return {
        newReply,
      };
    } else {
      throw generateError("Comment not found", HttpStatusCodes.NOT_FOUND);
    }
  }

  // like Comments API
  public async likeComments({ user_id, comment_id }: ICommentLikeParams) {
    const user = await Users.findById(user_id);
    const comment = await Comments.findById(comment_id);
    if (!user) {
      throw generateError("User not found", HttpStatusCodes.NOT_FOUND);
    }
    if (!comment) {
      throw generateError("comment not found", HttpStatusCodes.NOT_FOUND);
    }
    const isCommentLiked = comment.likes.get(user_id);
    if (isCommentLiked === undefined) {
      comment.likes.set(user_id, true);
      comment.commentLikeCount += 1; // Increment
    } else {
      comment.likes.delete(user_id);
      comment.commentLikeCount -= 1; // Decrement
    }

    await comment.save();

    return {
      comment,
      isCommentLiked: !isCommentLiked,
    };
  }

  public async deleteOwnComment({ comment_id, user_id }: IDeleteCommentParams) {
    const user = await Users.findById(user_id);
    const comment = await Comments.findById(comment_id);
    if (!user) {
      throw generateError(
        "User not do not accept to delete this comment",
        HttpStatusCodes.NOT_FOUND
      );
    }
    if (!comment) {
      throw generateError("comment not found", HttpStatusCodes.NOT_FOUND);
    }
    await Comments.deleteOne({
      _id: comment_id,
      customer_id: user_id,
    });
    return {
      Delete: "Delete Own Comment successfully",
    };
  }

  public async getAllComments() {
    const comment = await Comments.find({});
    return comment;
  }

  public async getAllCommentsInPosts(slug: string) {
    const orchid = await Orchids.findOne({ slug: slug });
    if(!orchid){
      throw generateError("Orchid not found", HttpStatusCodes.NOT_FOUND);
    }
    const commentInPosts = await Comments.find({
      orchid: orchid._id
    });
    if (!commentInPosts) {
      throw generateError("Comment not found", HttpStatusCodes.NOT_FOUND);
    }
    return commentInPosts;
  }

  //Request administrators to delette inappropriate comment in his/her post
  // administrators
  public async deleteComment(comment_id: string) {
    const comment = await Comments.findById(comment_id);
    if (!comment) {
      throw generateError("comment not found", HttpStatusCodes.NOT_FOUND);
    }
    await Comments.deleteOne({
      _id: comment_id,
    });
    return {
      Delete: "Delete Own Comment successfully",
    };
  }

  ////// ************

  /// ************ USER Creator PROFILE *********////

}
export default new commentServices();