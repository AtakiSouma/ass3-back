import { NextFunction, Request, Response } from "express";
import CustomError, { generateError } from "../libs/handlers/errorsHandlers";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import categoriesServices from "../services/categories.services";
import {
  sendSuccessResponse,
  sendSuccessResponseBoolean,
  sendSuccessResponseWithStatusCode,
} from "../constants/successResponse";

const CategoriesController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        throw generateError("Invalid input data", HttpStatusCodes.BAD_REQUEST);
      }
      const category = await categoriesServices.createNewCategories({
        name,
        description,
      });
      return sendSuccessResponse(res, HttpStatusCodes.OK, category);
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
  updateCategoryById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      if (!name || !description) {
        throw generateError("Input is invalid", HttpStatusCodes.BAD_REQUEST);
      }
      const updatedCategory = await categoriesServices.updateCategoriesById({
        id,
        name,
        description,
      });
      if (updatedCategory)
        return sendSuccessResponse(res, HttpStatusCodes.OK, updatedCategory);
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

  updateCategoryBySlug: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        throw generateError("Orchid not found", HttpStatusCodes.NOT_FOUND);
      }
      const { name, description } = req.body;
      const updatedCategory = await categoriesServices.updateCategoriesBySlug({
        slug,
        name,
        description,
      });
      if (updatedCategory)
        return sendSuccessResponse(res, HttpStatusCodes.OK, updatedCategory);
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

  getOneCategoryById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const Category = await categoriesServices.getOneCategoryById({ id });
      if (Category)
        return sendSuccessResponse(res, HttpStatusCodes.OK, Category);
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

  getOneCategoryBysLug: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const Category = await categoriesServices.getOneCategoryBySlug({ slug });
      if (Category)
        return sendSuccessResponse(res, HttpStatusCodes.OK, Category);
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
  deleteCategoriesSlug: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const Category = await categoriesServices.DeleteOneCategoryBySlug({
        slug,
      });
      if (Category)
        return sendSuccessResponseWithStatusCode(res, HttpStatusCodes.OK);
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
  deleteCategoriesId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const Category = await categoriesServices.DeleteOneCategoryById({ id });
      if (Category)
        return sendSuccessResponseBoolean(
          res,
          HttpStatusCodes.CREATED,
          Category
        );
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
  allCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, limit, page } = req.body;
      const Category = await categoriesServices.getAllCategories(
        search,
        page,
        limit
      );
      if (Category)
        return sendSuccessResponse(res, HttpStatusCodes.OK, Category);
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
  allCategoriesWithNoPaging: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const Category = await categoriesServices.getAllcategorywithNopaging();
      if (Category)
        return sendSuccessResponse(res, HttpStatusCodes.OK, Category);
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

export default CategoriesController;
