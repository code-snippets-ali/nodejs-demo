const mongoose = require("mongoose");
const { profileSchema } = require("./profile");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { DBConstants } = require("./DBConstants");
const expiresIn = "3000s";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: DBConstants.NameMinLength,
        maxlength: DBConstants.NameMaxLength,
    },
    email: {
        type: String,
        required: true,
        maxlength: DBConstants.EmailMaxLength,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: DBConstants.PasswordMinLength,
        maxlength: DBConstants.PasswordMaxLength,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
});

userSchema.methods.generateToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey"),
        { expiresIn: expiresIn }
    );
    return token;
};

userSchema.methods.generateRefreshToken = function () {
    const refresh_token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey")
    );
    return refresh_token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
exports.expiresIn = expiresIn;
