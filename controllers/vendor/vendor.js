import { DATA_LIMIT_1 } from "../../constants.js";
import { Vendor } from "../../models/vendor/vendor.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerNewVendor = async (req, res, next) => {
  try {
    const { name, category, subCategory, minCost, negotiable, contactDetails } =
      req.body;

    // Check if the user already exists based on the mobile
    const existingUserMobile = await Vendor.findOne({
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

    await Vendor.create({
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

// Get single vendor
export const getSingleVendorByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const vendor = await Vendor.findOne({ customId: customId });

    if (!vendor) {
      return next(new ErrorHandler("Vendor not found", 404));
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllVendors = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const skip = (pageNo - 1) * DATA_LIMIT_1;


    // Check if the user already exists based on the mobile
    const vendors = await Vendor.find({}).skip(skip).limit(DATA_LIMIT_1);
    if (!vendors || vendors.length === 0) {
      return next(new ErrorHandler("Vendor not found", 404));
    }

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSingleVendorByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const vendor = await Vendor.findOneAndDelete({ customId });
    if (!vendor) {
      return next(new ErrorHandler("Vendor not found", 404));
    }

    res.status(200).json({
      success: true,
      data: "Vendor deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
