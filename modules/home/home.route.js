const express = require('express');
const router = express.Router({});

const HomeController = require('./home.controller');

router.get('/', HomeController.getCoursesListForHomePage);

module.exports = router;
