const getFavoritesList = require("./get-favorites-list.test");
const addFavorite = require('./add-favorite.test');

module.exports = () => {
    getFavoritesList();
    addFavorite();
};