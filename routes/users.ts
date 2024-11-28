import express from "express";
import { getProfile, updateProfile } from "../controllers/userController";
const { auth } = require("../middleware/auth");
const router = express.Router();

router.route("/me").get(auth, getProfile).patch(auth, updateProfile);

module.exports = router;
