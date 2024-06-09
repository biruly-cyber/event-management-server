import { DATA_LIMIT_1 } from "../../constants.js";
import { Photographer } from "../../models/photographer/photographer.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerNewPhotographer = async (req, res, next) => {
  try {
    const { name, category, subCategory, minCost, negotiable, contactDetails } =
      req.body;

    // Check if the user already exists based on the mobile
    const existingUserMobile = await Photographer.findOne({
      "contactDetails.mobile": contactDetails.mobile,
    });
    if (existingUserMobile) {
      return next(
        new ErrorHandler(
          `User with mobile no: "${contactDetails.mobile}" already exists!`,
          400
        )
      );
    }

    let customId = Math.floor(1000000 + Math.random() * 9000000);

    await Photographer.create({
      name,
      category,
      subCategory,
      minCost,
      negotiable,
      contactDetails,
      customId: customId,
    });

    res.status(200).json({
      success: true,
      message: `Congratulations ${
        name?.split(" ")?.[0]
      }! Welcome to you have completed your registration.`,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

// Get single photographer
export const getSinglePhotographerByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const photographer = await Photographer.findOne({ customId: customId });

    if (!photographer) {
      return next(new ErrorHandler("Photographer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: photographer,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllPhotographers = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const skip = (pageNo - 1) * DATA_LIMIT_1;

    // Check if the user already exists based on the mobile
    const photographer = await Photographer.find({})
      .skip(skip)
      .limit(DATA_LIMIT_1);
    if (!photographer || photographer.length === 0) {
      return next(new ErrorHandler("Photographer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: photographer,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSinglePhotographerByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const photographer = await Photographer.findOneAndDelete({ customId });
    if (!photographer) {
      return next(new ErrorHandler("Photographer not found", 404));
    }

    res.status(200).json({
      success: true,
      data: "Photographer deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
