const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const CoursesConstant = require("../../modules/courses/courses.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

const getCoursesListByLecturer = async () =>
    describe("Lecturers::get courses list by lecturer test", () => {

    });

module.exports = getCoursesListByLecturer;
