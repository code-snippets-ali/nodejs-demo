import express from "express";
import { UserService } from "../serviceobjects/UserService";
import { getProfile, updateProfile } from "../controllers/userController";
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/me", auth, getProfile);

router.patch("/me", auth, updateProfile);

module.exports = router;
