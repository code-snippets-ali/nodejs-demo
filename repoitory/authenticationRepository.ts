import { IAuthenticateModel } from "../database/Models/IAuthenticateModel";
import { IUserModel } from "../database/Models/IUserModel";

import { BaseRepository } from "./BaseRepository";

const { Authenticate } = require("../database/authenticate");
const { User } = require("../database/user");

export class AuthenticationRepository extends BaseRepository<IAuthenticateModel> {
    constructor() {
        super(Authenticate);
    }

    async findByEmail(email: string): Promise<IAuthenticateModel | null> {
        const model: IAuthenticateModel = Authenticate.findOne({
            email: email,
        }).populate("user");
        return model;
    }

    async createAuthenticationForUser(
        email: string,
        password: string,
        name: string
    ): Promise<IUserModel> {
        const authentication = new Authenticate({
            email,
            password,
            name,
            passwordChangedAt: new Date(),
        });

        const user = new User({
            name,
            email,
        });
        authentication.user = user;
        await authentication.save();
        await user.save();
        return user;
    }

    async findByToken(token: string): Promise<IAuthenticateModel | null> {
        const model: IAuthenticateModel = Authenticate.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });
        return model;
    }
}
