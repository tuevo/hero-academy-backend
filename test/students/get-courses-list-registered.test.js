const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const RegistrationsConstant = require("../../modules/registrations/registrations.constant");

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfLecturer = null;
let tokenOfStudent = null;

const getCoursesListRegistered = async () =>
    describe("Students::get courses list registered test", () => {

    });

module.exports = getCoursesListRegistered;