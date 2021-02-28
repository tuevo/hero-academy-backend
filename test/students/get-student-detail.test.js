const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const StudentsConstant = require("../../modules/students/students.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

const getStudentDetail = async () =>
    describe("Students::get student detail test", () => {

    });

module.exports = getStudentDetail;
