import { DATA_LIMIT_1 } from "../../constants.js";
import { Decorator } from "../../models/decorator/decorator.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerNewDecorator = async (req, res, next) => {
  try {
    const { name, category, subCategory, minCost, negotiable, contactDetails } =
      req.body;

    // Check if the user already exists based on the mobile
    const existingUserMobile = await Decorator.findOne({
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

    await Decorator.create({
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

// Get single decorator
export const getSingleDecoratorByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const decorator = await Decorator.findOne({ customId: customId });

    if (!decorator) {
      return next(new ErrorHandler("Decorator not found", 404));
    }

    res.status(200).json({
      success: true,
      data: decorator,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllDecorators = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const skip = (pageNo - 1) * DATA_LIMIT_1;

    // Check if the user already exists based on the mobile
    const decorators = await Decorator.find({}).skip(skip).limit(DATA_LIMIT_1);
    if (!decorators || decorators.length === 0) {
      return next(new ErrorHandler("Decorator not found", 404));
    }

    res.status(200).json({
      success: true,
      data: decorators,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSingleDecoratorByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const decorator = await Decorator.findOneAndDelete({ customId });
    if (!decorator) {
      return next(new ErrorHandler("Decorator not found", 404));
    }

    res.status(200).json({
      success: true,
      data: "Decorator deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
