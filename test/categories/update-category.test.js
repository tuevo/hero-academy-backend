const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const categoryConstant = require("../../modules/categories/categories.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const addCategory = async () =>
  describe("Categories :: Update category", () => {
    beforeEach((done) => {
      try {
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
              accessToken = res.body.data.meta.accessToken;
            }

            done();
          });
      } catch (e) {
        done(e);
      }
    });

    it("Category should be not found", (done) => {
      try {
        chai
          .request(server)
          .put(`${constants.BASE_URL}/602a0c06e99eaa14a41df641`)
          .send({
            name: 'Thần học',
            categoryClusterId: '602a0bfde99eaa14a41df640'
          })
          .set('accessToken', accessToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.NOT_FOUND);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  categoryConstant.MESSAGES.UPDATE_CATEGORY.CATEGORY_NOT_FOUND
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

module.exports = addCategory;