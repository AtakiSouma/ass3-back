import express from "express";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import storage from "../firebase/firebaseStorage";
import { sendSuccessResponse } from "../constants/successResponse";
import { HttpStatusCode } from "axios";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import * as admin from "firebase-admin";

const uploadToFirebase = multer.memoryStorage();

const bucket = admin.storage().bucket();

const upload = multer({
  storage: uploadToFirebase,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).any();

function checkFileType(file: Express.Multer.File, cb: any) {
  const fileTypes = /jpeg|png|jpg/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Please upload images only");
  }
}

const uploadController = {
  uploadFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get file from request
      const file = req.file;
      if (file) {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        const blob = storage.file(fileName);
        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: {
            contentType: file.mimetype,
          },
        });
        //if error
        blobStream.on("error", (error) => {
          return generateError("error" , HttpStatusCodes.BAD_REQUEST)
        });
        // if success
        blobStream.on("finish", () => {
          // get public URL
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
          //   res.status(200).json({ fileName, fileUrl: publicUrl });
          return sendSuccessResponse(res, HttpStatusCodes.OK, {
            fileName,
            fileUrl: publicUrl,
          });
        });
        blobStream.end(file.buffer);
      } else {
        return generateError("Images failed" , HttpStatusCodes.BAD_REQUEST)
      }
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
  uploadMultipleFiles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (files && files.length > 0) {
        const uploadedFiles: { fileName: string; fileUrl: string }[] = [];

        for (const file of files) {
          const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
          const blob = storage.file(fileName);
          const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
              contentType: file.mimetype,
            },
          });

          let errorHandled = false;

          blobStream.on("error", (error) => {
            if (!errorHandled) {
              errorHandled = true;
              res.status(400).json({
                message: error.message,
              });
            }
          });

          await new Promise<void>((resolve) => {
            blobStream.on("finish", () => {
              if (!errorHandled) {
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
                const result = { fileName, fileUrl: publicUrl };
                uploadedFiles.push(result);
                resolve(undefined);
              }
            });

            blobStream.end(file.buffer);
          });
        }

        sendSuccessResponse(res, HttpStatusCodes.OK, uploadedFiles);
      } else {
        res.status(400).json({
          message: "Please upload at least one file",
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof CustomError) {
        next(error);
      } else if (error instanceof Error) {
        next(error.message);
      } else {
        next(error);
      }
    }
  },

  uploadImagesWithfirebase: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    upload(req, res, async (err: any) => {
      if (!err && req.files !== undefined) {
        try {
          const files = req.files as Express.Multer.File[];
          const uploadedFiles: { fileName: string; fileUrl: string }[] = [];

          for (const file of files) {
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = uniqueSuffix + path.extname(file.originalname);

            const fileUpload = bucket.file(fileName);
            const stream = fileUpload.createWriteStream({
              resumable: false,
              metadata: {
                contentType: file.mimetype,
              },
            });

            await new Promise<void>((resolve) => {
              stream.on("error", (error) => {
                res.status(400).json({
                  message: error.message,
                });
                resolve();
              });

              stream.on("finish", () => {
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
                  bucket.name
                }/o/${encodeURIComponent(fileName)}?alt=media`;
                uploadedFiles.push({ fileName, fileUrl: publicUrl });
                resolve();
              });

              stream.end(file.buffer);
              
            });
          }

          res.status(200).json(uploadedFiles);
        } catch (error) {
          console.error("Error uploading files:", error);
          res.status(500).send("Internal Server Error");
        }
      } else if (!err && req.files == undefined) {
        res.statusMessage = "Please select a file to upload";
        res.status(400).end();
      } else {
        res.statusMessage =
          err === "Please upload images only"
            ? err
            : "Photo exceeds limit of 5mb";
        res.status(400).end();
      }
    });
  },
};
export default uploadController;
