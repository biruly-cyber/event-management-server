import express from "express";
import { login, registerUser } from "../../controllers/user/user.js";

const router = express.Router();

router.post("/new", registerUser);
router.post("/login", login);

export default router;
