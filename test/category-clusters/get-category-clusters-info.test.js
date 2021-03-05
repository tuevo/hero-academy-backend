const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const categoryClustersConstant = require("../../modules/category-clusters/category-clusters.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const getCategoryClustersInfo = async () =>
    describe("CategoryClusters :: Get category cluster info", () => {

    });

module.exports = getCategoryClustersInfo;