import express, { Request, Response, Application } from "express";
import authController from "../../controllers/auth.controller";
import { auth } from "firebase-admin";
import multer from "multer";
import imagesController from "../../controllers/images.controller";
import middlewareController from "../../middlewares/verifyToken.middleware";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
router.post("/",middlewareController.verifyToken, upload.single("file"),imagesController.uploadFile);
router.post("/multiple",middlewareController.verifyToken, upload.array("file",5), imagesController.uploadMultipleFiles);
router.post("/upload" ,middlewareController.verifyToken, imagesController.uploadImagesWithfirebase);

export default router;
