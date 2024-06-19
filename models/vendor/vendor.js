import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const vendorSchema = new mongoose.Schema({
  nameOfBusiness: {
    type: String,
    required: [false, "Name required"],
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  city: {
    type: String,
    trim: true,
  },

  sectorType: {
    type: String,
    trim: true,
  },

  businessCategory: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    trim: true,
  },

  mobile: {
    type: Number,
    trim: true,
  },

  customId: {
    type: String,
    required: [true],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
});

vendorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
    return next();
  }
  next();
});

// JWT TOKEN
vendorSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JET_SECRET, {
    expiresIn: process.env.JET_EXPIRE,
  });
};

// Generate password reset token
vendorSchema.methods.generatePasswordResetToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and add to vendorSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const Vendor = mongoose.model("Vendor", vendorSchema);
