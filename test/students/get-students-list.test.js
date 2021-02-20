const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const StudentsConstant = require("../../modules/students/students.constant");

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfStudent = null;

const getStudentListTest = async () =>
  describe("Students::get student list test", () => {
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

    it("get student list test :: token is not exists", (done) => {
      try {
        chai
          .request(server)
          .get("/api/students/")
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

    it("get student list test :: the account is not allowed to access", (done) => {
      try {
        chai
          .request(server)
          .get("/api/students/")
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

    it("get student list test :: get students list successfully", (done) => {
      try {
        chai
          .request(server)
          .get("/api/students/")
          .set({
            accessToken: tokenOfAdmin,
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.OK);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  StudentsConstant.MESSAGES.GET_STUDENTS_LIST
                    .GET_STUDENTS_LIST_SUCCESSFULLY
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

module.exports = getStudentListTest;
