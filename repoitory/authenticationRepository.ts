const { Authenticate } = require("../database/authenticate");
interface IAuthentication {
    email: string;
    _id: string;
}
export class AuthenticationRepository {
    async getAuthenticationRecord(
        email: string
    ): Promise<IAuthentication | null> {
        const auth = await Authenticate.findOne({ email: email });
        return auth;
    }
}
