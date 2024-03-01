import express, { Request, Response, Application } from "express";
import CategoriesController from "../../controllers/categories.controller";
import middlewareController from "../../middlewares/verifyToken.middleware";
import OrchidsController from "../../controllers/orchid.controller";
const router = express.Router();
// router.post("/import", OrchidsController.importOrchids)
router.post("/create", middlewareController.verifyToken,OrchidsController.createOrchids);
router.post("/get-one",middlewareController.verifyToken, OrchidsController.getOneOrchid);
router.post("/", middlewareController.verifyToken ,OrchidsController.getallOrchids);;
router.put("/",middlewareController.verifyToken,  OrchidsController.updateOrchid);
router.delete("/:slug",  OrchidsController.deleteOrchid);
router.put("/new-comment" , middlewareController.verifyToken, OrchidsController.createNewComment)
router.get("/" , middlewareController.verifyToken  , OrchidsController.getallOrchidswithoutPaging)
export default router;
