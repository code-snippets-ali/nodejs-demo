import { IBaseModel } from "../IBaseModel";
import { IUserModel } from "./IUserModel";

export interface IAuthenticateModel extends IBaseModel {
    email: string;
    password: string;
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    user: IUserModel;
}
