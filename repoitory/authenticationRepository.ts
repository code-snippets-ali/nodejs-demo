import { IAuthenticateModel } from "../database/Models/IAuthenticateModel";
import { IUser } from "../serviceobjects/UserService";
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
    ): Promise<IUser> {
        const authentication = new Authenticate({
            email,
            password,
            name,
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
}
