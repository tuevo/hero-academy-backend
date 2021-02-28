const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const StudentsConstant = require("../../modules/students/students.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfLecturer = null;
let tokenOfStudent = null;

const getStudentDetail = async () =>
    describe("Students::get student detail test", () => {
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

        it("get student detail test :: token is not exists", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/6022cea755394d25003dadd5`)
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

        it("get student detail test :: lecturer account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/6022cea755394d25003dadd5`)
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

        it("get student detail test :: student account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/6022cea755394d25003dadd5`)
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

module.exports = getStudentDetail;
