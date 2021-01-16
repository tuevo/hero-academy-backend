const express = require('express');
const router = express.Router({});
const multer = require('multer');
const upload = multer();

const CoursesController = require('./courses.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');

module.exports = router;
