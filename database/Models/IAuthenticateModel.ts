import { Types } from "mongoose";
import { IBaseModel } from "../IBaseModel";
import { IUserModel } from "./IUserModel";

export interface IAuthenticateModel extends IBaseModel {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: string;
    user: IUserModel;
}
