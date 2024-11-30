import express from "express";
import { getProfile, updateUser } from "../controllers/userController";
import { validateUserPatchRequest } from "../core-sdk/contracts/user/UserPatchRequest";
import { validateUserPutRequest } from "../core-sdk/contracts/user/UserPutRequest";

const { auth } = require("../middleware/auth");
const router = express.Router();

router
    .route("/me")
    .get(auth, getProfile)
    .patch(auth, validateUserPatchRequest, updateUser)
    .put(auth, validateUserPutRequest, updateUser);

module.exports = router;
