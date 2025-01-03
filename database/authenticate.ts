import mongoose, { Document, Schema, Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
import { IAuthenticateModel } from "./Models/IAuthenticateModel";

const { DBConstants } = require("./DBConstants");

const authenticateSchema = new Schema<IAuthenticateModel>({
    email: {
        type: String,
        required: true,
        maxlength: DBConstants.EmailMaxLength,
        unique: true,
        lowecase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: DBConstants.PasswordMinLength,
        maxlength: DBConstants.PasswordHashedMaxLength,
    },
    passwordChangedAt: { type: Date, required: true },
    passwordResetToken: { type: String, required: false },
    passwordResetExpires: { type: Date, required: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Authenticate = mongoose.model("Authenticate", authenticateSchema);

exports.Authenticate = Authenticate;
exports.authenticateSchema = authenticateSchema;
