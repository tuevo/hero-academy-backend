const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const CoursesConstant = require("../../modules/courses/courses.constant");

chai.use(chaiHttp);

const getCourseDetail = () =>
    describe("Courses::Get course detail", async () => {
        it("CourseDetail test :: Get course detail successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get("/api/courses/60223b77f7e4d94848a4eeec")
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(CoursesConstant.MESSAGES.GET_COURSE_DETAIL.GET_COURSE_DETAIL_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getCourseDetail;