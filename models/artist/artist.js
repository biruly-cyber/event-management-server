import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Name required"],
  },

  category: {
    type: String,
  },

  subCategory: {
    type: String,
  },

  minCost: {
    type: Number,
  },

  negotiable: {
    type: Boolean,
  },

  likes: {
    type: Number,
  },

  feedback: [
    {
      user: mongoose.Schema.Types.ObjectId,
      comment: String,
      rating: Number,
    },
  ],

  images: [
    {
      docUrl: String,
      docPath: String,
      docType: String,
      verified: Boolean,
    },
  ],

  videos: [
    {
      docUrl: String,
      docPath: String,
      docType: String,
      verified: Boolean,
    },
  ],

  contactDetails: {
    mobile: {
      type: Number,
      unique: true,
      required: [true, "Please enter mobile number"],
      minlength: [10, "Mobile no. must be at least 10 digits"],
      maxlength: [10, "Mobile no. must be at most 10 digits"],
    },

    altMobile: {
      type: Number,
      required: [true, "Please enter mobile number"],
      minlength: [10, "Mobile no. must be at least 10 digits"],
      maxlength: [10, "Mobile no. must be at most 10 digits"],
    },

    address: {
      type: String,
    },

    state: { type: String },
    city: { type: String },
    pinCode: {
      type: Number,
      minlength: [6, "Pin code must be 6digits"],
      maxlength: [6, "Pin code must be 6digits"],
    },
  },

  clicks: {
    type: Number,
    default: 0,
  },

  impressions: {
    type: Number,
    default: 0,
  },

  features: [
    {
      type: String,
    },
  ],

  ipAddress: {
    type: String,
  },

  deleted: {
    type: Boolean,
  },

  hidden: { type: Boolean },

  minDiscount: { type: Number, default: 0 },

  maxDiscount: { type: Number, default: 0 },

  role: {
    type: String,
    enum: [
      "superAdmin",
      "admin",
      "vendor",
      "user",
    ],
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
    type: Number,
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

ArtistSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
    return next();
  }
  next();
});

// JWT TOKEN
ArtistSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JET_SECRET, {
    expiresIn: process.env.JET_EXPIRE,
  });
};

// Generate password reset token
ArtistSchema.methods.generatePasswordResetToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and add to ArtistSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const Artist = mongoose.model("Artist", ArtistSchema);
