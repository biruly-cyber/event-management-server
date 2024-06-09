import express from "express";
import {
  deleteSingleSoundByCustomId,
  getAllSounds,
  getSingleSoundByCustomId,
  registerNewSound,
} from "../../controllers/sound/sound.js";

const router = express.Router();

router.post("/new", registerNewSound);
router.get("/:customId", getSingleSoundByCustomId);
router.get("/all/:pageNo", getAllSounds);
router.delete("/:customId", deleteSingleSoundByCustomId);

export default router;
