import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Name required"],
  },

  email: {
    type: String,
    required: [false, "Email required"],
  },

  password: {
    type: String,
    required: [false, "Email required"],
    minLength: [6, "Password must be at least 6 characters"],
  },

  mobile: {
    type: Number,
    required: [false, "Mobile no. required"],
    minLength: [10, "Mobile no. must be at least 10 digits"],
    maxLength: [10, "Mobile no. must be at least 10 digits"],
  },

  eventLocation: {
    state: String,
    city: String,
  },

  eventDate: {
    type: Number,
  },

  eventFor: {
    type: String,
  },

  customId: {
    type: String,
    required: [true],
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
