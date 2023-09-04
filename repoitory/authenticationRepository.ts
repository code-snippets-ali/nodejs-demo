import { IAuthenticateModel } from "../database/Models/IAuthenticateModel";
import { BaseRepository } from "./BaseRepository";

const { Authenticate } = require("../database/authenticate");

interface IAuthentication {
    email: string;
    _id: string;
}
export class AuthenticationRepository extends BaseRepository<IAuthenticateModel> {
    constructor() {
        super(Authenticate);
    }
    async getAuthenticationRecord(
        email: string
    ): Promise<IAuthentication | null> {
        const auth = await Authenticate.findOne({ email: email });
        return auth;
    }

    async findByEmail(email: string): Promise<IAuthenticateModel | null> {
        const model: IAuthenticateModel = Authenticate.findOne({
            email: email,
        });
        return model;
    }
}
