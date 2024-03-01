import mongoose from "mongoose";
import { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const validateMongoDBId = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw generateError("This is invalid MongoDB ID" , HttpStatusCodes.NOT_FOUND)
  }
};
export default validateMongoDBId;
