import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import authServices from "../services/auth.services";
import { sendSuccessResponse } from "../constants/successResponse";

const authController = {
  resetToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.cookies.uid;
      const user = await authServices.newToken(uid, res);
      return sendSuccessResponse(res, HttpStatusCodes.OK,user);
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

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw generateError("Input is invalid", HttpStatusCodes.BAD_REQUEST);
      }
      const user = await authServices.login({ email, password }, res);

      return sendSuccessResponse(res, HttpStatusCodes.OK, user);
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

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authServices.logout(res);

      return sendSuccessResponse(res, HttpStatusCodes.OK, { user });
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
};
export default authController;
