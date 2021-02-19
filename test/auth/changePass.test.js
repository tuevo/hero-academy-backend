const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

const accessToken = { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOjMsInB1YmxpY0lkIjpudWxsLCJpc0RlbGV0ZWQiOmZhbHNlLCJfaWQiOiI2MDIyMWQ0MzYyNjlhMTRlMzBhMmQ3ODAifSwiaWF0IjoxNjEzNzIxNjcwLCJleHAiOjE2MTM3MjE3MzB9.vQyGZ0Wb4PRPLghMjvnd-jfxY8_PYsKGASQk17KLn0U" };

const changePassTest = () =>
    describe("Auth::changePass", async () => {
        it("changePass test :: old password incorrect", (done) => {
            try {
                chai
                    .request(server)
                    .put("/api/auth/password")
                    .set(accessToken)
                    .send({ currentPassword: "12345678", newPassword: "12345678", confirmNewPassword: "12345678" })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.BAD_REQUEST);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    AuthConstant.MESSAGES.CHANGE_PASS
                                        .OLD_PASSWORD_INCORRECT
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("changePass test :: Password and confirm password not match", (done) => {
            try {
                chai
                    .request(server)
                    .put("/api/auth/password")
                    .set(accessToken)
                    .send({ currentPassword: "123456789", newPassword: "12345678", confirmNewPassword: "123456789" })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.BAD_REQUEST);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    AuthConstant.MESSAGES.CHANGE_PASS
                                        .PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

    });

module.exports = changePassTest;