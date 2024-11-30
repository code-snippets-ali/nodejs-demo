import { IResponse } from "../IResponse";

export interface IAuthenticationResponse extends IResponse {
    accessToken?: string;
    refreshToken?: String;
    expiresIn?: String;
}
