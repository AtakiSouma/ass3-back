import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import userServices from "../services/user.services";
import {
  sendSuccessResponse,
  sendSuccessResponseBoolean,
  sendSuccessResponseString,
  sendSuccessResponseWithStatusCode,
} from "../constants/successResponse";
import validateMongoDBId from "../util/validateMongoDbID";
import { Users } from "../models/Users";

const userController = {
  registerUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (!username || !password || !confirmPassword || !email) {
        throw generateError("Input is invalid", HttpStatusCodes.BAD_REQUEST);
      }
      const user = await userServices.registerUser({
        email,
        password,
        confirmPassword,
        username,
      });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  checkUserName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;
      const userName = await userServices.checkUsername(username);
      return sendSuccessResponse(res, HttpStatusCodes.OK, userName);
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

  checkUserNameExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username } = req.body;
      const userName = await userServices.checkUserNameExist(username);
      return sendSuccessResponseBoolean(res, HttpStatusCodes.OK, userName);
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
  getOneUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body;
      validateMongoDBId(uid);
      const user = await userServices.getOneUser({ uid });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  getOneUserByEmail: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.params;
      const user = await userServices.getOneUserByEmail({ email });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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
  getAllUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userServices.getAllUser();
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  BlockUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      validateMongoDBId(uid);
      const user = await userServices.blockUser({ uid });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  UnBlockUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      validateMongoDBId(uid);
      const user = await userServices.unBlockUser({ uid });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  ChangeRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body;
      validateMongoDBId(uid);
      const user = await userServices.changeRoles({ uid });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, username, avatar, phoneNumber, gender } = req.body;
      validateMongoDBId(uid);
      const user = await userServices.updateProfile({
        uid,
        username,
        avatar,
        phoneNumber,
        gender,
      });
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user);
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
  getAllUsersCustomer: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { search, limit, page } = req.body;
      const users = await userServices.getAlluserCustomers(search, page, limit);
      if (users) return sendSuccessResponse(res, HttpStatusCodes.OK, users);
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
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, current_password, new_password, confirm_password } =
        req.body;
        if(!uid || !current_password || !new_password || !confirm_password){
          throw generateError("Invalid Input" ,HttpStatusCodes.NOT_FOUND)
        }
      const users = await userServices.ChangePassword({
        current_password,
        uid,
        new_password,
        confirm_password,
      });
      if (users) return sendSuccessResponse(res, HttpStatusCodes.OK, users);
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

export default userController;
