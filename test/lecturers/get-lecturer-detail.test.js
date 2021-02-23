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

    });

module.exports = getLecturerDetail;
