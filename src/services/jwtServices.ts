import HttpStatusCodes from "../constants/HttpStatusCodes";
import { generateError } from "../libs/handlers/errorsHandlers";
import { tokenGenerate } from "./auth.services";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Tokens } from "../models/Token";

class JwtServices {
  public generatePairToken(input: tokenGenerate) {
    const secret_key =
      process.env.SECRET_KEY || "rvGx7efcLKUVL6uK8MgR7X6cpFLUP9vg";

    const accessToken = jwt.sign(input, secret_key, {
      subject: input.id,
      expiresIn: 60 * 60 * 10000,
      algorithm: "HS256",
    });
    const expiresInMilliseconds = 60 * 60 * 60 * 1000;
    const randomBytes = crypto.randomBytes(16).toString("base64");
    const expirationTime = Date.now() + expiresInMilliseconds;
    const refreshToken = `${randomBytes}.${expirationTime}`;
    console.log("refresh token: " + refreshToken);
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string) {
    const secret_key =
      process.env.SECRET_KEY || "rvGx7efcLKUVL6uK8MgR7X6cpFLUP9vg";
    try {
      const payload = jwt.verify(token, secret_key);
      return payload;
    } catch (err) {
      console.log(err);
      throw generateError("Token not valid", HttpStatusCodes.FORBIDDEN);
    }
  }

  public isTokenExpired(token: string) {
    try {
      const secret_key =
        process.env.SECRET_KEY || "rvGx7efcLKUVL6uK8MgR7X6cpFLUP9vg";
      const decodedToken: any = jwt.verify(token, secret_key);

      if (decodedToken) {
        const currentTimeInSeconds = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp > currentTimeInSeconds) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return true;
    }
  }

  public DecodeToken(token: string) {
    try {
      const secret_key =
        process.env.SECRET_KEY || "rvGx7efcLKUVL6uK8MgR7X6cpFLUP9vg";
      const decodedToken: any = jwt.verify(token, secret_key);
      return decodedToken;
    } catch (error) {
      throw generateError("Token not valid", HttpStatusCodes.FORBIDDEN);
    }
  }

  public async checkRefreshTokenInDB(refresh_token: string) {
    const checkExist = await Tokens.find({ refresh_token: refresh_token });
    if (checkExist) {
      return true;
    } else {
      throw generateError("Token not valid", HttpStatusCodes.FORBIDDEN);
    }
  }
  public async checkRefreshToken(refresh_token: string) {
    const user = await Tokens.findOne({ refresh_token });
    if (!user) {
      throw generateError(
        "No Refresh token present in db or not matched",
        HttpStatusCodes.NOT_FOUND
      );
    } else {
      return true;
    }
  }
}
export default new JwtServices();
