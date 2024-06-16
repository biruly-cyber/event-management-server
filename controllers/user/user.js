import ErrorHandler from "../../utils/Errorhandler.js";
import { User } from "../../models/user/user.js";
import { sendOtpToUser } from "../../utils/sendOtpToUser.js";
import { userActivity } from "../../utils/usersActivity.js";
import sendToken from "../../utils/sendToken.js";

// Register user
export const registerUser = async (req, res, next) => {
  try {
    // Generating OTP
    let tempOtp = Math.floor(100000 + Math.random() * 900000);
    const { mobile } = req.body;

    const existingUser = await User.findOne({ mobile });
    let generatedId = Math.floor(100000 + Math.random() * 900000);

    let user;
    if (!existingUser) {
      user = await User.create({
        mobile: Number(mobile),
        otp: tempOtp,
        otpValidity: Date.now() + 15 * 60 * 1000,
        customId: `ek${generatedId}`,
      });

      // Store users activity
      userActivity(
        user?._id,
        `New registration`,
        `New registration with mobile no. ${mobile}`
      );
    }

    if (existingUser) {
      await User.findOneAndUpdate(
        { mobile: Number(mobile) },
        { otp: tempOtp, otpValidity: Date.now() + 15 * 60 * 1000 },
        { runValidators: false }
      );

      // Store users activity
      if (existingUser) {
        userActivity(
          existingUser?._id,
          "New OTP request",
          "User requested for OTP (One Time Password)"
        );
      }
      // Send OTP to user
    }

    await sendOtpToUser(mobile, tempOtp, next);

    res.status(201).json({
      success: true,
      message: "User data saved successfully",
      user: { _id: existingUser?._id, mobile },
      otp: tempOtp,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

// Send OTP
export const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) return next(new ErrorHandler("Mobile no. is not valid", 400));

    let otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to user
    await sendOtpToUser(mobile, otp, next);

    // Store OTP in db
    const existingUser = await User.findOneAndUpdate(
      { mobile: Number(mobile) },
      { otp: otp, otpValidity: Date.now() + 15 * 60 * 1000 },
      { runValidators: false, new: true }
    );

    userActivity(
      existingUser?._id,
      "New OTP request",
      "User requested for OTP (One Time Password)"
    );

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { otp, mobile } = req.body;

    if (!mobile)
      return next(new ErrorHandler("Opps! Mobile no. required!", 400));
    if (!otp) return next(new ErrorHandler("Opps! OTP required!", 400));

    const existingUser = await User.findOne({
      mobile: Number(mobile),
    });

    console.log("DB Otp", existingUser);

    if (existingUser?.otp !== Number(otp)) {
      return next(new ErrorHandler("Opps! Wrong OTP!", 400));
    }

    let validity =
      (Date.now() - Date.parse(existingUser?.otpValidity)) / (1000 * 60);
    if (validity > 15.0) {
      return next(new ErrorHandler(`Opps! OTP validity expired!`, 400));
    }

    // Store user activity
    userActivity(
      existingUser?._id,
      "OTP verified",
      "User logged in successfully"
    );
    sendToken(existingUser, 200, res, "OTP verified successfully");
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

// Register user
export const updateUserBasicInformation = async (req, res, next) => {
  try {
    const { userId, name, gender } = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(new ErrorHandler("Opps! User not found", 404));
    }

    // Update user info
    existingUser.name = name;
    existingUser.gender = gender;

    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "User data saved successfully",
      user: { _id: existingUser?._id, mobile },
      otp: tempOtp,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
