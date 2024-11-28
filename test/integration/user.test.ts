import request from "supertest";
const app = require("../../server");
let server: any;
import { AuthenticationService } from "../../serviceobjects/authenticationService";
import { AC } from "../../serviceobjects/Utilities/app-constants";

describe("auth middleware", () => {
    const service = new AuthenticationService();
    beforeAll(async () => {
        server = await app.listen(8184);
    });
    afterAll(async () => {
        await server.close();
    });

    it("1. should return 401 Unauthorized if token is not provided", async () => {
        const res = await request(app).get("/api/users/me").send();
        expect(res.status).toBe(401);
    });
    it("2. should return 200 Success if client is logged in", async () => {
        const token = service.generateToken(AC.TestUserId, AC.TestRoles);
        const res = await request(app)
            .get("/api/users/me")
            .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
            .send();
        expect(res.status).toBe(200);
        expect(res.body).not.toBe(null);
        expect(res.body.name).toContain("Ali Zafar Test");
        expect(res.body.roles).toContain(500);
    });
});
