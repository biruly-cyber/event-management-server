import express from "express";
import {
  registerUser,
  sendOtp,
  updateUserBasicInformation,
  verifyOtp,
} from "../../controllers/user/user.js";

const router = express.Router();

router.post("/new", registerUser);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/updateUserBasicInfo", updateUserBasicInformation);

export default router;
