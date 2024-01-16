import express from "express";

import { signup, login, getAccessToken } from "../Controllers/user_controllers.js";

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/getAccessToken", getAccessToken);

export default router;
