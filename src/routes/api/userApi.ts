import express, { Request, Response, Application } from "express";
import userController from "../../controllers/user.controller";
const router = express.Router();
router.post("/register", userController.registerUser);
router.post("/get-one", userController.getOneUser);
router.get("/email/:email", userController.getOneUserByEmail);
router.get("/", userController.getAllUser);
router.patch("/block/:uid", userController.BlockUser);
router.patch("/unblock/:uid", userController.UnBlockUser);
router.patch("/change/role" ,userController.ChangeRole)
router.put("/update-profile" , userController.updateProfile);
router.post("/all-customer" , userController.getAllUsersCustomer)
export default router;

