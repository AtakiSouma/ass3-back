import express from "express";
import userRouter from "./api/userApi";
import authRouter from "./api/authApi";
import categoriesRouter from "./api/categoryApi";
import orchidApi from "./api/orchidApi";
import commentApi from "./api/commentApi";
import imagesApi from "./api/imagesApi"
export function route(app: express.Express) {
  app.use("/api/comment" , commentApi)
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/category", categoriesRouter);
  app.use("/api/orchid", orchidApi)
  app.use("/api/upload" , imagesApi)

}
