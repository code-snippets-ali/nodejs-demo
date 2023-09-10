import { Types } from "mongoose";
import { IBaseModel } from "../IBaseModel";

export interface IUserModel extends IBaseModel {
    name: string;
    roles: [Number];
    phone: string;
    gender: string;
    houseNumber: string;
    streetNumber: string;
    city: string;
    state: string;
    country: string;

    isActive: boolean;
    email: string;
    passwordUpdatedAt: Date;
    doctor: Types.ObjectId;
    patient: Types.ObjectId;
}
