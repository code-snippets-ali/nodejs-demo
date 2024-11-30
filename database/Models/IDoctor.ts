import { IBaseModel } from "../IBaseModel";

export interface IDoctor extends IBaseModel {
    firstName: { type: string; required: true };
    lastName: { type: string; required: true };
    specialization: { type: string; required: true };
    description?: string;
    isActive: { type: Boolean; default: false };
}
