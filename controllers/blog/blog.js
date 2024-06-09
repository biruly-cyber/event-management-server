import { DATA_LIMIT_1 } from "../../constants.js";
import { Blog } from "../../models/blog/blog.js";
import ErrorHandler from "../../utils/Errorhandler.js";
import { generateSlug } from "../../utils/generateSlug.js";

// Register user
export const AddNewBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags, author } = req.body;

    // Check if the blog with the same title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return next(
        new ErrorHandler(
          `A blog with the title "${title}" already exists!`,
          400
        )
      );
    }

    await Blog.create({
      title,
      slug: generateSlug(title),
      content,
      category,
      tags,
      author,
    });

    res.status(200).json({
      success: true,
      message: `Congratulations! Your blog post "${title}" has been successfully created.`,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

// Get single blog
export const getSingleBlogByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    const blog = await Blog.findOne({ customId });

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const page = parseInt(pageNo, 10) || 1;
    const skip = (page - 1) * DATA_LIMIT_1;

    const blogs = await Blog.find({}).skip(skip).limit(DATA_LIMIT_1);

    if (!blogs || blogs.length === 0) {
      return next(new ErrorHandler("No blogs found", 404));
    }

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSingleBlogByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    const blog = await Blog.findOneAndDelete({ customId });

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
