import HttpStatusCodes from "../constants/HttpStatusCodes";
import { generateError } from "../libs/handlers/errorsHandlers";
import { Response } from "express";
import { Users } from "../models/Users";
import mongoose from "mongoose";
import { IRoles, loginInput } from "../constants/data";
import jwtServices from "./jwtServices";
//import { TokenClass } from "typescript";
import { Tokens } from "../models/Token";
import bcryptModule from "../util/bcryptModule";

export interface tokenGenerate {
  id: string;
  email?: string;
  isAdmin: boolean;
  username: string;
  avatar:string;
}
class AuthService {
  private generateResponse(
    input: tokenGenerate,
    accessToken: string,
    refreshToken: string,
    link: string
  ) {
    if (!input.id || !accessToken || !input.email) {
      throw generateError("Invalid data", HttpStatusCodes.CONFLICT);
    }
    return {
      user: input,
      access_token: accessToken,
      refresh_token: refreshToken,
      link: link,
    };
  }
  private async setRefreshTokenInDB(userId: string, refreshToken: string) {
    try {
      const user = await Users.findOne({ _id: userId });
      if (!user) {
        throw generateError(
          "User is not logged in",
          HttpStatusCodes.UNAUTHORIZED
        );
      }
      const existingToken = await Tokens.findOne({ user: userId });
      if (existingToken) {
        existingToken.refresh_token = refreshToken;
        await existingToken.save();
      } else {
        await Tokens.create({
          user: userId,
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      throw generateError(
        "Error saving refresh token",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private setRefreshToken(
    res: Response,
    refreshToken: string,
    access_token: string,
    username: string,
    email: string,
    avatar: string,
    isAdmin: boolean
  ) {
    res.cookie("rhk", refreshToken, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", access_token, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("username", username, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("email", email, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("avatar", avatar, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("isAdmin", isAdmin, {
      domain: "localhost",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  public async newToken(id: string, res: Response) {
    const user = await Users.findOne({
      _id: id,
    });
    if (!user) {
      throw generateError(
        "You are not authenticated!",
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    const tokenGenerate: tokenGenerate = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      username:user.username,
      avatar: user.avatar
    };
    const { accessToken, refreshToken } =
      jwtServices.generatePairToken(tokenGenerate);
    this.setRefreshToken(
      res,
      refreshToken,
      accessToken,
      user.username,
      user.email,
      user.avatar ||
        "https://cdn.donmai.us/original/fe/90/fe90c2ad3c46efd002abe86229bcdc37.png",
      user.isAdmin
    );
    let link = "";
    if (user.isAdmin === true) {
      link = "/orchid";
    }
    if (user.isAdmin === false) {
      link = "/dashboard";
    }
    this.setRefreshTokenInDB(user.id, refreshToken);

    return this.generateResponse(
      tokenGenerate,
      accessToken,
      refreshToken,
      link
    );
  }

  public async login({ email, password }: loginInput, res: Response) {
    const user = await Users.findOne({ email: email });
    if (!user || !user.password) {
      throw generateError("User not found", HttpStatusCodes.UNAUTHORIZED);
    }
    if(user.isBlocked === true){
      throw generateError("User is Blocked", HttpStatusCodes.NOT_ACCEPTABLE);

    }
    const compare = await bcryptModule.compare(password, user.password);
    if (compare) {
      const tokenGenerate: tokenGenerate = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        username:user.username,
        avatar:user.avatar
      };

      const { accessToken, refreshToken } =
        jwtServices.generatePairToken(tokenGenerate);
      this.setRefreshToken(
        res,
        refreshToken,
        accessToken,
        user.username,
        user.email,
        user.avatar ||
          "https://cdn.donmai.us/original/fe/90/fe90c2ad3c46efd002abe86229bcdc37.png",
        user.isAdmin
      );
      let link = "";
      if (user.isAdmin === true) {
        link = "/orchid";
      }
      if (user.isAdmin === false) {
        link = "/dashboard";
      }

      this.setRefreshTokenInDB(user.id, refreshToken);
      return this.generateResponse(
        tokenGenerate,
        accessToken,
        refreshToken,
        link
      );
    } else {
      throw generateError("Password not correct", HttpStatusCodes.UNAUTHORIZED);
    }
  }

  public async logout(res: Response) {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.clearCookie("avatar");
      res.clearCookie("email");
      res.clearCookie("isAdmin");
      res.clearCookie("rhk");
      res.clearCookie("username");
      return "Logged out successfully";
    } catch (error) {
      throw generateError(
        "Cannot log out",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new AuthService();
