import request from "supertest";
const app = require("../../server");
let server: any;
import { AuthenticationService } from "../../serviceobjects/authenticationService";
import { AC } from "../../serviceobjects/Utilities/app-constants";

describe("/api/user", () => {
    const service = new AuthenticationService();
    const token = service.generateToken(AC.TestUserId, AC.TestRoles);
    beforeAll(async () => {
        server = await app.listen(8184);
    });
    afterAll(async () => {
        await server.close();
    });
    describe("GET /me", () => {
        it("1. should return 401 Unauthorized if token is not provided", async () => {
            const res = await request(app).get("/api/users/me").send();
            expect(res.status).toBe(401);
        });
        it("2. should return 200 Success if client is logged in", async () => {
            const res = await request(app)
                .get("/api/users/me")
                .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
                .send();
            expect(res.status).toBe(200);
            expect(res.body).not.toBe(null);
            expect(res.body.name).toContain("Ali Zafar Test");
        });
    });
    describe("PATCH /me", () => {
        it("1. should return 200 Success. When atleast one parameter is sent", async () => {
            const res = await request(app)
                .patch("/api/users/me")
                .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
                .send({ name: "Ali Zafar Test" });
            expect(res.status).toBe(200);
            expect(res.body).not.toBe(null);
            expect(res.body.name).toContain("Ali Zafar Test");
        });
        it("2. should return 400 Bad Request. When no parameter is sent", async () => {
            const res = await request(app)
                .patch("/api/users/me")
                .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
                .send();
            expect(res.status).toBe(400);
        });
    });
    describe("PUT /me", () => {
        it("1. should return 200 Success. When all non optional parameters are provided", async () => {
            const res = await request(app)
                .put("/api/users/me")
                .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
                .send({
                    name: "Ali Zafar Test",
                    email: "ali.zaffar+4@gmail.com",
                    isActive: true,
                });
            expect(res.status).toBe(200);
            expect(res.body).not.toBe(null);
            expect(res.body.name).toContain("Ali Zafar Test");
        });
        it("2. should return 400 Bad Request. When one required parameter is missing", async () => {
            const res = await request(app)
                .put("/api/users/me")
                .set(`${AC.Authorization}`, `${AC.Bearer} ${token}`)
                .send({ name: "Ali Zafar Test" });
            expect(res.status).toBe(400);
        });
    });
});
