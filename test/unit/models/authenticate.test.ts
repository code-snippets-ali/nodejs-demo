import { AuthenticationService } from "../../../serviceobjects/authenticationService";

describe("verifyToken", () => {
    let authenticationService = new AuthenticationService();
    it("should generate a token for a given user id", () => {
        const userId = "12345";

        const token = authenticationService.generateToken(userId, [500]);
        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });
    it("should verify a valid token", async () => {
        const userId = "12345";
        const token = authenticationService.generateToken(userId, [500]);

        const decoded = await authenticationService.verifyToken(token);
        expect(decoded).toBeDefined();
        expect(decoded._id).toBe(userId);
        expect(decoded.access_level).toContain(500);
    });
    it("should throw an error for an invalid token", async () => {
        const token = "invalid-token";

        try {
            await authenticationService.verifyToken(token);
        } catch (ex: any) {
            expect(ex).toBeDefined();
            expect(ex.name).toBe("Invalid Access Token");
        }
    });
});
