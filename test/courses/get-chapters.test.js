const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const ChaptersConstant = require('../../modules/chapters/chapters.constant');

chai.use(chaiHttp);

const getChaptersTest = () =>
    describe("Courses::Get chapters", async () => {
        it("Chapters test :: Get chapters successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get("/api/courses/60223b77f7e4d94848a4eeec/chapters")
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(ChaptersConstant.MESSAGES.GET_CHAPTERS.GET_CHAPTERS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Chapters test :: Course not found", (done) => {
            try {
                chai
                    .request(server)
                    .get("/api/courses/60223b77f7e4d94848a4eee2/chapters")
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.NOT_FOUND);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.include('COURSE_NOT_FOUND');;
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getChaptersTest;