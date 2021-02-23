const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const LecturersConstant = require("../../modules/lecturers/lecturers.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfLecturer = null;
let tokenOfStudent = null;

const getLecturerDetail = async () =>
    describe("Lecturers::get lecturer detail test", () => {
        //before running api must get token
        beforeEach((done) => {
            try {
                //get token of admin
                chai
                    .request(server)
                    .post("/api/auth/login")
                    .send({
                        email: "admin2020@gmail.com",
                        password: "123456789",
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            tokenOfAdmin = res.body.data.meta.accessToken;
                        }

                        //get token of lecturer
                        chai
                            .request(server)
                            .post("/api/auth/login")
                            .send({
                                email: "lecturer1@gmail.com",
                                password: "123456789",
                            })
                            .end((err, res) => {
                                if (err) {
                                    console.log(err);
                                }

                                if (res) {
                                    tokenOfLecturer = res.body.data.meta.accessToken;
                                }
                            });

                        //get token of student
                        chai
                            .request(server)
                            .post("/api/auth/login")
                            .send({
                                email: "student1@gmail.com",
                                password: "123456789",
                            })
                            .end((err, res) => {
                                if (err) {
                                    console.log(err);
                                }

                                if (res) {
                                    tokenOfStudent = res.body.data.meta.accessToken;
                                }
                            });

                        done();
                    });
            } catch (e) {
                done(e);
            }
        });

        it("get lecturer detail test :: token is not exists", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/`)
                    .set({
                        accessToken: "",
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("INVALID_TOKEN");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get lecturer detail test :: lecturer account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/`)
                    .set({
                        accessToken: tokenOfLecturer,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("ACCESS_IS_NOT_ALLOWED");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get lecturer list test :: student account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/`)
                    .set({
                        accessToken: tokenOfStudent,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("ACCESS_IS_NOT_ALLOWED");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getLecturerDetail;
