import express from "express";
const { refresh } = require("../middleware/auth");

const {
    register,
    signin,
    token,
    forgotPassword,
} = require("../controllers/authenticationController");

const router = express.Router();

router.post("/register", register);

router.post("/signin", signin);

router.post("/token", refresh, token);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
