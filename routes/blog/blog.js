import express from "express";
import {
  AddNewBlog,
  deleteSingleBlogByCustomId,
  getAllBlogs,
  getSingleBlogByCustomId,
} from "../../controllers/blog/blog.js";

const router = express.Router();

router.post("/new", AddNewBlog);
router.get("/:customId", getSingleBlogByCustomId);
router.get("/all/:pageNo", getAllBlogs);
router.delete("/:customId", deleteSingleBlogByCustomId);

export default router;
