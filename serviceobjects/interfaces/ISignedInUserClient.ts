import { Role } from "../enums/Role";

export interface ISignedInUserClient {
    _id: string;
    access_levels: Role[];
    iat: number;
}

export interface IRefreshUserClient {
    _id: string;
    iat: number;
}
