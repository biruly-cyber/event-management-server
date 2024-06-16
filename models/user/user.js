import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Name required"],
  },

  mobile: {
    type: Number,
    required: [true, "Mobile no. required"],
    minLength: [10, "Mobile no. must be at least 10 digits"],
    maxLength: [10, "Mobile no. must be at least 10 digits"],
  },

  gender: {
    type: String,
    required: [false, "Gender required"],
  },

  images: [
    {
      docUrl: String,
      docPath: String,
      docType: String,
      verified: Boolean,
    },
  ],

  deleted: {
    type: Boolean,
  },

  hidden: { type: Boolean },

  minDiscount: { type: Number, default: 0 },

  maxDiscount: { type: Number, default: 0 },

  role: {
    type: String,
    enum: ["superAdmin", "admin", "vendor", "user"],
    default: "user",
  },

  // OTP
  otp: {
    type: Number,
  },

  otpValidity: {
    type: Date,
    default: Date.now,
  },

  otpVerified: {
    type: Boolean,
    default: false,
  },

  customId: {
    type: String,
    required: [true],
  },

  deviceToken: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
    return next();
  }
  next();
});

// JWT TOKEN
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JET_SECRET, {
    expiresIn: process.env.JET_EXPIRE,
  });
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and add to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
