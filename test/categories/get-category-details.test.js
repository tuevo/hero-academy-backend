const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
chai.use(chaiHttp);

const constants = require('./constants.test');
const CategoriesConstant = require("../../modules/categories/categories.controller");

const getCategoryDetails = async () => {
    describe('Categories :: Get category details', () => {

    });
}

module.exports = getCategoryDetails;
