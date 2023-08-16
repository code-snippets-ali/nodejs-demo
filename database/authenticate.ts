import mongoose, { Document, Schema } from "mongoose";

const { DBConstants } = require("./DBConstants");

const authenticateSchema = new Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Authenticate = mongoose.model("Authenticate", authenticateSchema);

exports.Authenticate = Authenticate;
exports.authenticateSchema = authenticateSchema;
