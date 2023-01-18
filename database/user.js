const mongoose = require("mongoose");

const { DBConstants } = require("./DBConstants");

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
        maxlength: DBConstants.PasswordHashedMaxLength,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
});

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.userSchema = userSchema;
