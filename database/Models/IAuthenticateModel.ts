import { Types } from "mongoose";
import { IBaseModel } from "../IBaseModel";

export interface IAuthenticateModel extends IBaseModel {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: string;
    user: Types.ObjectId;
}
