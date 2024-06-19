import ErrorHandler from "../../utils/Errorhandler.js";
import { User } from "../../models/user/user.js";
import sendToken from "../../utils/sendToken.js";
import bcrypt from "bcrypt";

// Register user
export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      eventLocation,
      eventDate,
      eventFor,
    } = req.body;

    //Check existing user
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
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
      return next(new ErrorHandler("Opps! login credentials mismatched!", 400));
    }

    // Send token
    user.password = undefined;
    sendToken(user, 200, res, `Welcome back! ${user?.name || ""}`);
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
