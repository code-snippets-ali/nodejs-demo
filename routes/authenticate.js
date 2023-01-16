const express = require("express");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, expiresIn } = require("../database/user");
const { Profile } = require("../database/profile");
const { refresh } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    const profile = new Profile({
        name: user.name,
    });
    await profile.save();
    user.profile = profile;
    await user.save();

    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    const Token = {
        accessToken: token,
        refreshToken: refreshToken,
    };
    const response = { ..._.pick(user, ["_id", "name", "email"]), ...Token };
    res.header("x-auth-token", token).send(response);
});

router.post("/signin", async (req, res) => {
    const { error } = validateSignIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isValidPassword)
        return res.status(400).send("Invalid email or password");

    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    res.header("x-auth-token", token).send({
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
    });
});

router.post("/token", refresh, async (req, res) => {
    const refreshToken = new User().generateRefreshToken();
    const token = new User().generateToken();

    res.header("x-auth-token", token).send({
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
    });
});

function validateSignIn(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
}

function validateRegister(req) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
}

module.exports = router;
