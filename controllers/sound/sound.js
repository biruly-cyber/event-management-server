import { DATA_LIMIT_1 } from "../../constants.js";
import { Sound } from "../../models/sound/sound.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerNewSound = async (req, res, next) => {
  try {
    const { name, category, subCategory, minCost, negotiable, contactDetails } =
      req.body;

    // Check if the user already exists based on the mobile
    const existingUserMobile = await Sound.findOne({
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

    await Sound.create({
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

// Get single sound
export const getSingleSoundByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const sound = await Sound.findOne({ customId: customId });

    if (!sound) {
      return next(new ErrorHandler("Sound not found", 404));
    }

    res.status(200).json({
      success: true,
      data: sound,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllSounds = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const skip = (pageNo - 1) * DATA_LIMIT_1;

    // Check if the user already exists based on the mobile
    const sounds = await Sound.find({}).skip(skip).limit(DATA_LIMIT_1);
    if (!sounds || sounds.length === 0) {
      return next(new ErrorHandler("Sound not found", 404));
    }

    res.status(200).json({
      success: true,
      data: sounds,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSingleSoundByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const sound = await Sound.findOneAndDelete({ customId });
    if (!sound) {
      return next(new ErrorHandler("Sound not found", 404));
    }

    res.status(200).json({
      success: true,
      data: "Sound deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
