import { DATA_LIMIT_1 } from "../../constants.js";
import { Vendor } from "../../models/vendor/vendor.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerVendor = async (req, res, next) => {
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
    const newUser = new User({
      name,
      email,
      password,
      mobile,
      eventLocation,
      eventDate,
      eventFor,
      customId: `ek${tempCustomId}`,
    });

    // Saving user entity
    await newUser.save();

    // Send token
    newUser.password = undefined;
    sendToken(
      newUser,
      201,
      res,
      "Congratulations! You have successfully registered to EVENTKAREN.COM"
    );
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check existing user
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email, "i") },
    }).select("+password");

    if (!user)
      return next(new ErrorHandler(`Opps! ${email} is not registered!`, 400));

    // Match password
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return next(new ErrorHandler("Opps! user credentials mismatched!", 400));
    }

    // Send token
    user.password = undefined;
    sendToken(user, 200, res, `Welcome back! ${user?.name || ""}`);
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
