import express, { Request, Response, Application } from "express";
import userController from "../../controllers/user.controller";
import middlewareController from "../../middlewares/verifyToken.middleware";
const router = express.Router();
router.post("/register", userController.registerUser);
router.post("/get-one", userController.getOneUser);
router.get("/email/:email", userController.getOneUserByEmail);
router.get("/", userController.getAllUser);
router.put("/block/:uid", userController.BlockUser);
router.put("/change-password" ,middlewareController.verifyToken  , userController.changePassword)
router.patch("/unblock/:uid", userController.UnBlockUser);
router.patch("/change/role" ,userController.ChangeRole)
router.put("/update-profile" , userController.updateProfile);
router.post("/all-customer" , userController.getAllUsersCustomer)
export default router;

