import { NextFunction, Request, Response } from "express";
import jwtServices from "../services/jwtServices";
import { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { JwtPayload } from "jsonwebtoken";
import authServices from "../services/auth.services";
// import { jwtDecode } from "jwt-decode";
// import { sendSuccessResponse } from "../constants/successResponse";
// import { auth } from "firebase-admin";
import { jwtDecode } from "jwt-decode";
import { sendSuccessResponse } from "../constants/successResponse";
import { auth } from "firebase-admin";
import { Users } from "../models/Users";
const middlewareController = {
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization');

      if (token) {
        const accessToken = token.split(' ')[1];
        console.log('token: ' + accessToken);
        const payload = jwtServices.verifyToken(accessToken) as JwtPayload;
        if (payload) {
          res.locals.payload = payload;
          next();
        }
      } else {
        throw generateError('You are not authenticated', HttpStatusCodes.FORBIDDEN);
      }
    } catch (error) {
      throw error;
    }
  },

  requestRefresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refresh_token;
      console.log("token from cookie: ", token);
      // check if refreshToken is valid in DB
      if (token) {
        const compare = await jwtServices.checkRefreshToken(token);
        if (compare) {
          next();
        }
      } else {
        throw generateError(
          "You are not authenticated",
          HttpStatusCodes.FORBIDDEN
        );
      }
    } catch (error) {
      next(error);
    }
  },

  // isAdmin: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const email = req.cookies.email;
  //     console.log("email from cookie", email);
  //     const admin = await Users.findOne({
  //       email: email,
  //       role: "65b71267edb2c9e7fb816131",
  //     });
  //     if (!admin) {
  //       throw new Error("You are not Admin");
  //     } else {
  //       next();
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // },

};

export default middlewareController;
