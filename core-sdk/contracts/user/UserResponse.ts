import { IResponse } from "../IResponse";

export interface IUserResponse extends IResponse {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
}
