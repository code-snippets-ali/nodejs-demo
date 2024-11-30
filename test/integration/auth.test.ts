import request from "supertest";
const app = require("../../server");
let server: any;
import { AuthenticationService } from "../../serviceobjects/authenticationService";
import { AC } from "../../serviceobjects/Utilities/app-constants";
import { HttpStatusCode } from "../../serviceobjects/enums/HttpStatusCode";

describe("auth middleware", () => {
    const service = new AuthenticationService();
    beforeAll(async () => {
        server = await app.listen(8184);
    });
    beforeEach(() => {});
    afterEach(() => {});
    afterAll(async () => {
        await server.close();
    });

    it("1. should return 401 Unauthorized if token is not provided", async () => {
        const res = await request(app).get("/api/users/me").send();
        expect(res.status).toBe(401);
    });
    it("2. should return 401 Unauthorized if incorrect token is provided", async () => {
        const res = await request(app)
            .get("/api/users/me")
            .set(AC.Authorization, `Bearer invalid`)
            .send();
        expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
    });
    it("3. should return 200 Success if correct token is provided", async () => {
        const token = service.generateToken(AC.TestUserId, AC.TestRoles);
        const res = await request(app)
            .get("/api/users/me")
            .set(AC.Authorization, `${AC.Bearer} ${token}`)
            .send();
        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body).not.toBe(null);
        expect(res.body.name).toContain("Ali Zafar Test");
    });
});
