import express from "express";
import {
  registerNewArtist,
  getSingleArtistByCustomId,
  getAllArtists,
  deleteSingleArtistByCustomId,
} from "../../controllers/artist/artist.js";
const router = express.Router();

router.post("/new", registerNewArtist);
router.get("/:customId", getSingleArtistByCustomId);
router.get("/all/:pageNo", getAllArtists);
deleteSingleArtistByCustomId;
export default router;
