import { HttpStatusCode } from "axios";
import crypto from "crypto";

import {
  IChangeRoles,
  IEmailParams,
  IFollowCreator,
  IResetPasswordParams,
  IUidParams,
  IUpdateProfile,
  IUsersParams,
  IforgotPassParams,
} from "../constants/data";
import { generateError } from "../libs/handlers/errorsHandlers";
import { Users } from "../models/Users";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import bcryptModule from "../util/bcryptModule";
import { UUID } from "mongodb";
import emailServices from "./email.services";
export interface updatePassword {
  uid:string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

class userServices {
  public async ChangePassword({
    uid,
    current_password,
    new_password,
    confirm_password,
  }: updatePassword) {
    const existUser = await Users.findById(uid);
    if (!existUser) {
      throw generateError("User not found", HttpStatusCodes.NOT_FOUND);
    }
    const compare = await bcryptModule.compare(
      current_password,
      existUser.password
    );
    if (compare) {
      if (new_password === confirm_password) {
        const pwd = await bcryptModule.getHash(new_password);
       existUser.password = pwd || current_password;
       await existUser.save();
       return existUser;
      }else{
        throw generateError("Password not matching", HttpStatusCodes.CONFLICT);

      }
    } else {
      throw generateError("Wrong current password", HttpStatusCodes.CONFLICT);
    }
  }
  public async registerUser({
    username,
    email,
    password,
    confirmPassword,
  }: IUsersParams) {
    const usernameExist = await Users.findOne({ username: username });
    if (usernameExist) {
      throw generateError("Username already exists", HttpStatusCodes.CONFLICT);
    }
    const userExisting = await Users.findOne({
      email: email,
    });
    if (userExisting) {
      throw generateError("Email already exists", HttpStatusCodes.CONFLICT);
    }

    if (password !== confirmPassword) {
      throw generateError(
        "Password is not matching!",
        HttpStatusCodes.CONFLICT
      );
    }
    const pwd = await bcryptModule.getHash(password);
    const new_user = await Users.create({
      email: email,
      password: pwd,
      username: username,
      avatar:
        "https://i.pinimg.com/236x/f2/2b/f8/f22bf81d5d7b42a3bb83a9ab020242df.jpg",
      phoneNumber: null,
    });
    return new_user;
  }

  public async checkUsername(username: string) {
    const usernameExist = await Users.findOne({ username: username });
    if (usernameExist) {
      return {
        response: ` [ ${username} ] is already exist`,
      };
    } else {
      return {
        response: ` [ ${username}  ] is not  exist`,
      };
    }
  }

  public async checkUserNameExist(username: string) {
    const usernameExist = await Users.findOne({ username: username });
    if (!usernameExist) {
      throw generateError("User name is not exist", HttpStatusCodes.NOT_FOUND);
    }
    return true;
  }

  public async updateProfile({
    uid,
    username,
    avatar,
    phoneNumber,
    gender,
  }: IUpdateProfile) {
    const userExist = await Users.findById({ _id: uid });
    if (userExist) {
      userExist.username = username || userExist.username;
      userExist.avatar = avatar || userExist.avatar;
      userExist.phoneNumber = phoneNumber || userExist.phoneNumber;
      userExist.gender = gender || userExist.gender;
    } else {
      throw generateError("user is not exist!", HttpStatusCodes.CONFLICT);
    }
    const updatedUser = await userExist.save();
    return updatedUser;
  }

  public async changeRoles({ uid }: IChangeRoles) {
    const userExisting = await Users.findById({
      _id: uid,
    });
    if (userExisting) {
      if (userExisting.isAdmin === true) {
        userExisting.isAdmin = false;
      } else {
        userExisting.isAdmin = true;
      }
      userExisting.save();
      return {
        response: "Change roles succesffully",
        UserIsAdmin: userExisting.isAdmin,
      };
    } else {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
  }

  public async getOneUser({ uid }: IUidParams) {
    const userExisting = await Users.findById({
      _id: uid,
    });
    if (!userExisting) {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
    return userExisting;
  }
  public async getOneUserByEmail({ email }: IEmailParams) {
    const userExisting = await Users.findOne({
      email: email,
    });
    if (userExisting) {
      return userExisting;
    } else {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
  }

  public async getAllUser() {
    const userExisting = await Users.find();
    if (userExisting) {
      return userExisting;
    } else {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
  }

  public async blockUser({ uid }: IUidParams) {
    const userExisting = await Users.findById({ _id: uid });
    if (userExisting) {
      userExisting.isBlocked = !userExisting.isBlocked;
      await userExisting.save();
      return userExisting;
    } else {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
  }
  public async unBlockUser({ uid }: IUidParams) {
    const userExisting = await Users.findById({ _id: uid });
    if (userExisting) {
      userExisting.isBlocked = false;
      await userExisting.save();
      return userExisting;
    } else {
      throw generateError("User not found!", HttpStatusCodes.CONFLICT);
    }
  }

  public async getAlluserCustomers(
    search: string,
    page: number,
    limit: number
  ) {
    try {
      const query = {
        username: { $regex: new RegExp(search, "i") },
        isAdmin: false,
      };
      const userLists = await Users.find(query)
        .sort({ create_at: "desc" })
        .skip((page - 1) * limit)
        .limit(limit);
      const totalCount = await Users.countDocuments(query);
      const data = userLists.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        isBlocked: user.isBlocked,
        status: user.status,
      }));
      const response = {
        data,
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
      };
      return response;
    } catch (error) {
      console.log(error);
      throw generateError("Cannot get user!", HttpStatusCodes.BAD_REQUEST);
    }
  }
}

export default new userServices();
