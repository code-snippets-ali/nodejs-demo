import { IUserModel } from "../database/Models/IUserModel";
import { BaseRepository } from "./BaseRepository";
const { User } = require("../database/user");

export class UserRepository extends BaseRepository<IUserModel> {
    constructor() {
        super(User);
    }
}
