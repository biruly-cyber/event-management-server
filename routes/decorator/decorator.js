import express from "express";
import {
  deleteSingleDecoratorByCustomId,
  getAllDecorators,
  getSingleDecoratorByCustomId,
  registerNewDecorator,
} from "../../controllers/decorator/decorator.js";

const router = express.Router();

router.post("/new", registerNewDecorator);
router.get("/:customId", getSingleDecoratorByCustomId);
router.get("/all/:pageNo", getAllDecorators);
router.delete("/:customId", deleteSingleDecoratorByCustomId);

export default router;
