const express = require('express');
const router = express.Router({});

const UserController = require('./users.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');

router.get('/', CheckAccessTokenMiddleware, UserController.getUserInfo);

module.exports = router;
