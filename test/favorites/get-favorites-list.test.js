const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const FavoritesConstant = require("../../modules/favorites/favorites.constant");

chai.use(chaiHttp);

const getFavoritesList = async () =>
    describe("Favorites::get favorites list test", () => {

    });

module.exports = getFavoritesList;
