import { IBaseModel } from "../IBaseModel";

export interface IClinic extends IBaseModel {
    name: { type: string; required: true };
    phone?: string;
    email?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
    isActive: { type: Boolean; default: false };
}
