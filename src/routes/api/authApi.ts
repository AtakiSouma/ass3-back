import express, { Request, Response, Application } from "express";
import authController from "../../controllers/auth.controller";
import { auth } from "firebase-admin";
import middlewareController from "../../middlewares/verifyToken.middleware";

const router = express.Router();
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get('/verify-access', middlewareController.verifyToken, authController.resetToken);
router.post('/refresh-token', middlewareController.requestRefresh, authController.resetToken);
export default router;
