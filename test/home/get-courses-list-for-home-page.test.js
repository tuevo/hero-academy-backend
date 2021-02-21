const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const HomeConstant = require("../../modules/home/home.constant");

chai.use(chaiHttp);

const getCoursesListForHomePage = () =>
    describe("Home::Get courses list for home page", async () => {
        it("Home test :: Get courses list for home page successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get("/api/home")
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(HomeConstant.MESSAGE.GET_COURSER_FOR_HOME_PAGE
                                    .GET_COURSER_FOR_HOME_PAGE_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getCoursesListForHomePage;