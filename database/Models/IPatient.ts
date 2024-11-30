import { IBaseModel } from "../IBaseModel";

export interface IPatient extends IBaseModel {
    firstName: { type: string; required: true };
    lastName: { type: string; required: true };
    dateOfBirth: { type: Date; required: true };
    phone?: string;
    email?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
    healthCard?: string;
    isActive: { type: Boolean; default: false };
}
