import request from "supertest";
import { AuthenticationService } from "../../serviceobjects/authenticationService";
import { AC } from "../../serviceobjects/Utilities/app-constants";
import { HttpStatusCode } from "../../serviceobjects/enums/HttpStatusCode";
const app = require("../../server");
let server: any;
const { Authenticate } = require("../../database/authenticate");
const { User } = require("../../database/user");

/**
 * ali.zaffar+7@gmail.com is used as Test account for Integration Test.
 * Its _id and roles is used as TestUserId.
 * A new account is created "ali.zaffar+integrationtest@gmail.com" and deleted after the test
 * token and refresh token are generated for the test account
 *
 * test+notfound@gmail.com is used as a non existing email for testing
 */

describe("/api/authenticate", () => {
    const service = new AuthenticationService();
    const token = service.generateToken(AC.TestUserId, AC.TestRoles);
    const refreshToken = service.generateRefreshToken(AC.TestUserId);
    const forgotPasswordToken: string =
        service.generateForgotPasswordToken()[0];

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
    describe("POST /register", () => {
        it("1. should return 201 Created for registering a new user", async () => {
            const res = await request(app)
                .post("/api/authenticate/register")
                .send({
                    name: "Ali Zafar Integration Test",
                    password: "qwerty12345",
                    email: "ali.zaffar+integrationtest@gmail.com",
                });
            expect(res.status).toBe(HttpStatusCode.CREATED);
        });

        it("2. should return 400 Bad request for registering a user that already exist", async () => {
            const res = await request(app)
                .post("/api/authenticate/register")
                .send({
                    name: "Ali Zafar",
                    password: "qwerty12345",
                    email: "ali.zaffar+5@gmail.com",
                });
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
    });

    describe("POST /signin", () => {
        it("3. should return 400 bad request for no parameters", async () => {
            const res = await request(app)
                .post("/api/authenticate/signin")
                .send({});
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });

        it("4. should return 404 for Email Not Found", async () => {
            const res = await request(app)
                .post("/api/authenticate/signin")
                .send({ email: "ali@gmail.com", password: "testpassword" })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
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

    describe("POST /refreshToken", () => {
        it("6. should return 400 Bad request for no parameters", async () => {
            const res = await request(app)
                .post("/api/authenticate/token")
                .send({});
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("7. should return 401 UnAuthorized for invalid token", async () => {
            const res = await request(app)
                .post("/api/authenticate/token")
                .send({ refreshToken: "invalid-token" })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
        });
        it("8. should return 200 Success for correct token", async () => {
            const res = await request(app)
                .post("/api/authenticate/token")
                .send({ refreshToken: refreshToken })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.OK);
        });
    });

    describe("POST /forgot-password", () => {
        it("9. should return 400 Bad request for no parameters", async () => {
            const res = await request(app)
                .post("/api/authenticate/forgot-password")
                .send({});
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("9a. should return 400 Bad request for invalid email id", async () => {
            const res = await request(app)
                .post("/api/authenticate/forgot-password")
                .send({ email: "test+notfound.com" });
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("10. should return 404 Not Found for Email Not Found", async () => {
            const res = await request(app)
                .post("/api/authenticate/forgot-password")
                .send({ email: "test+notfound@gmail.com" })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
        });
        it("10a. should return 200 OK for Email Not Found", async () => {
            const res = await request(app)
                .post("/api/authenticate/forgot-password")
                .send({ email: "ali.zaffar+7@gmail.com" })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.OK);
        });
    });

    describe("POST /reset-password", () => {
        it("11. should return 400 Bad request for no parameters", async () => {
            const res = await request(app)
                .post("/api/authenticate/reset-password")
                .send({});
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        // it.only("12. should return 200 OK for correct information ", async () => {
        //     const res = await request(app)
        //         .post("/api/authenticate/reset-password")
        //         .send({
        //             token: forgotPasswordToken,
        //             changedPassword: "qwerty12345",
        //             confirmPassword: "qwerty12345",
        //         });
        //     expect(res.status).toBe(200);
        // });
    });

    describe("POST /update-password", () => {
        it("13. Should return 401 Unauthorized for no token", async () => {
            const res = await request(app)
                .post("/api/authenticate/update-password")
                .send({});
            expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
        });
        it("13a. should return 400 Bad request for no parameters", async () => {
            const res = await request(app)
                .post("/api/authenticate/update-password")
                .set(AC.Authorization, `${AC.Bearer} ${token}`)
                .send({});
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("14. should return 400 Bad Request for password and confirm password mismatch", async () => {
            const res = await request(app)
                .post("/api/authenticate/update-password")
                .set(AC.Authorization, `${AC.Bearer} ${token}`)
                .send({
                    currentPassword: "qwerty12345",
                    newPassword: "testpassword",
                    confirmPassword: "testpasswordMismatch",
                })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("15. should return 400 Bad Request for incorrect current password", async () => {
            const res = await request(app)
                .post("/api/authenticate/update-password")
                .set(AC.Authorization, `${AC.Bearer} ${token}`)
                .send({
                    currentPassword: "incorrectcurrentpassword",
                    newPassword: "testpassword",
                    confirmPassword: "testpasswordMismatch",
                })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
        });
        it("16. should return 200 Success for correct passwords", async () => {
            const res = await request(app)
                .post("/api/authenticate/update-password")
                .set(AC.Authorization, `${AC.Bearer} ${token}`)
                .send({
                    currentPassword: "qwerty12345",
                    newPassword: "qwerty12345",
                    confirmNewPassword: "qwerty12345",
                })
                .set("Content-Type", "application/json");
            expect(res.status).toBe(HttpStatusCode.OK);
        });
    });
});
