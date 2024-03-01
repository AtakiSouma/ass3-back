import HttpStatusCodes from "../constants/HttpStatusCodes";
import {
  IPaginationParams,
  ITagParams,
  ITagParamsSlug,
  IParams,
  IEmailParams,
  ISendEmail,
} from "../constants/data";
import { generateError } from "../libs/handlers/errorsHandlers";
import GenerateSlug from "../util/GenerateSlug";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
class emailServices {
  public async sendEmail({ receiver, html, subject }: ISendEmail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

   const info =  await transporter.sendMail({
      from: '"Ataki Souma 👻" <hoangnam1772004@gmail.com>', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: html,
    });
    return info;
  }
}

export default new emailServices();
