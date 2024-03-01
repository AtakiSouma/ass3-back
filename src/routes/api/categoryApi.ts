import express, { Request, Response, Application } from "express";
import CategoriesController from "../../controllers/categories.controller";
import middlewareController from "../../middlewares/verifyToken.middleware";
const router = express.Router();

router.post("/create", middlewareController.verifyToken,CategoriesController.createCategory);
router.get("/:slug", CategoriesController.getOneCategoryBysLug);
router.post("/", middlewareController.verifyToken ,CategoriesController.allCategories);
router.put("/:slug",middlewareController.verifyToken,  CategoriesController.updateCategoryBySlug);
router.delete("/:slug", CategoriesController.deleteCategoriesSlug);
router.get("/" , middlewareController.verifyToken ,CategoriesController.allCategoriesWithNoPaging )
export default router;
