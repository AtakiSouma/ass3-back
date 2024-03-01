import express, { Request, Response, Application } from "express";
import middlewareController from "../../middlewares/verifyToken.middleware";
import commentsController from "../../controllers/comment.controller";
import { comment } from "postcss";
// posts
const router = express.Router();
router.post(
  "/",
  middlewareController.verifyToken,
  commentsController.createComments
);
router.put(
  "/",
  middlewareController.verifyToken,
  commentsController.replyComments
);
router.put(
  "/like",
  middlewareController.verifyToken,
  commentsController.likeComment
);
router.delete(
  "/",
  middlewareController.verifyToken,
  commentsController.deleteOwnComment
);
router.get(
  "/",
  middlewareController.verifyToken,
  commentsController.getAllComment
);
router.post("/inorchid" , middlewareController.verifyToken , commentsController.getAllCommentInPosts)
// // chung
// router.post("/posts/get" , commentsController.getAllCommentInCreatorProfile);
// router.post("/creator-profile/get",commentsController.getAllCommentInCreatorProfile)
// // Creator profile
// router.post("/creator-profile/:creator_id", commentsController.createCommentsToCreatorProfile);
// router.put("/creator-profile/reply/:creator_id/:comment_id", commentsController.replyCommentsToCreatorProfile);

export default router;
