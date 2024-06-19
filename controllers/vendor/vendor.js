import { Vendor } from "../../models/vendor/vendor.js";
import ErrorHandler from "../../utils/Errorhandler.js";
import sendToken from "../../utils/sendToken.js";
import bcrypt from "bcrypt";

// Register user
export const registerNewVendor = async (req, res, next) => {
  try {
    const {
      nameOfBusiness,
      state,
      city,
      sectorType,
      businessCategory,
      email,
      password,
      mobile,
    } = req.body;

    //Check existing user
    const existingVendor = await Vendor.findOne({ email: email });

    if (existingVendor) {
      return next(new ErrorHandler("You have already registered!", 400));
    }

    // Create new user
    let tempCustomId = Math.floor(100000 + Math.random() * 900000);
    const newVendor = new Vendor({
      nameOfBusiness,
      state,
      city,
      sectorType,
      businessCategory,
      email,
      password,
      mobile,
      customId: `ek${tempCustomId}`,
    });

    // Saving user entity
    await newVendor.save();

    // Send token
    newVendor.password = undefined;
    sendToken(
      newVendor,
      201,
      res,
      "Congratulations! You have successfully registered to EVENTKAREN.COM"
    );
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const loginVendor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check existing user
    const vendor = await Vendor.findOne({
      email: { $regex: new RegExp("^" + email, "i") },
    }).select("+password");

    if (!vendor)
      return next(new ErrorHandler(`Opps! ${email} is not registered!`, 400));

    // Match password
    const isMatched = await bcrypt.compare(password, vendor.password);

    if (!isMatched) {
      return next(new ErrorHandler("Opps! login credentials mismatched!", 400));
    }

    // Send token
    vendor.password = undefined;
    sendToken(vendor, 200, res, `Welcome back! ${vendor?.name || ""}`);
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
