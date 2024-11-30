import request from "supertest";
const app = require("../../server");
let server: any;
const { Authenticate } = require("../../database/authenticate");
const { User } = require("../../database/user");

describe("/api/authenticate", () => {
    beforeAll(async () => {
        server = await app.listen(8184);
    });
    beforeEach(() => {});
    afterEach(() => {});

    afterAll(async () => {
        await Authenticate.deleteMany({
            email: "ali.zaffar+integrationtest@gmail.com",
        }).exec();
        await User.deleteMany({ name: "Ali Zafar Integration Test" }).exec();
        await server.close();
    });

    it("1. should return 200 success for registering a new user", async () => {
        const res = await request(app).post("/api/authenticate/register").send({
            name: "Ali Zafar Integration Test",
            password: "qwerty12345",
            email: "ali.zaffar+integrationtest@gmail.com",
        });
        expect(res.status).toBe(201);
    });

    it("2. should return 400 Bad requesr for registering a user that already exist", async () => {
        const res = await request(app).post("/api/authenticate/register").send({
            name: "Ali Zafar",
            password: "qwerty12345",
            email: "ali.zaffar+5@gmail.com",
        });
        expect(res.status).toBe(400);
    });

    it("3. should return 400 bad request for no parameters", async () => {
        const res = await request(app)
            .post("/api/authenticate/signin")
            .send({});
        expect(res.status).toBe(400);
    });

    it("4. should return 401 UnAuthorizedfor Email Not Found", async () => {
        const res = await request(app)
            .post("/api/authenticate/signin")
            .send({ email: "ali@gmail.com", password: "testpassword" })
            .set("Content-Type", "application/json");
        expect(res.status).toBe(404);
    });
    it("5. should return 200 Success for Correct email and passwords", async () => {
        const res = await request(app)
            .post("/api/authenticate/signin")
            .send({
                email: "ali.zaffar+5@gmail.com",
                password: "qwerty12345",
            })
            .set("Content-Type", "application/json");
        expect(res.status).toBe(200);
    });
});
