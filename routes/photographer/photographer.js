import express from "express";
import {
  deleteSinglePhotographerByCustomId,
  getAllPhotographers,
  getSinglePhotographerByCustomId,
  registerNewPhotographer,
} from "../../controllers/photographer/photographer.js";

const router = express.Router();

router.post("/new", registerNewPhotographer);
router.get("/:customId", getSinglePhotographerByCustomId);
router.get("/all/:pageNo", getAllPhotographers);
router.delete("/:customId", deleteSinglePhotographerByCustomId);

export default router;
