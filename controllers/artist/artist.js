import { DATA_LIMIT_1 } from "../../constants.js";
import { Artist } from "../../models/artist/artist.js";
import ErrorHandler from "../../utils/Errorhandler.js";

// Register user
export const registerNewArtist = async (req, res, next) => {
  try {
    const { name, category, subCategory, minCost, negotiable, contactDetails } =
      req.body;

    // Check if the user already exists based on the mobile
    const existingUserMobile = await Artist.findOne({
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

    await Artist.create({
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

// Get single artist
export const getSingleArtistByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const artist = await Artist.findOne({ customId: customId });

    if (!artist) {
      return next(new ErrorHandler("Artist not found", 404));
    }

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const getAllArtists = async (req, res, next) => {
  try {
    const { pageNo } = req.params;
    const skip = (pageNo - 1) * DATA_LIMIT_1;

    // Check if the user already exists based on the mobile
    const artists = await Artist.find({}).skip(skip).limit(DATA_LIMIT_1);
    if (!artists || artists.length === 0) {
      return next(new ErrorHandler("Artist not found", 404));
    }

    res.status(200).json({
      success: true,
      data: artists,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};

export const deleteSingleArtistByCustomId = async (req, res, next) => {
  try {
    const { customId } = req.params;

    // Check if the user already exists based on the mobile
    const artist = await Artist.findOneAndDelete({ customId });
    if (!artist) {
      return next(new ErrorHandler("Artist not found", 404));
    }

    res.status(200).json({
      success: true,
      data: "Artist deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
