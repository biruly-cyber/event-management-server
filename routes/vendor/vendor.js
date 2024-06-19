import express from "express";
import {
  loginVendor,
  registerNewVendor,
} from "../../controllers/vendor/vendor.js";

const router = express.Router();

router.post("/new", registerNewVendor);
router.post("/login", loginVendor);

export default router;
