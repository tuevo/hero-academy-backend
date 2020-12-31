const express = require('express');
const router = express.Router({});

const UserController = require('./user.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

const {LoginValidationSchema} = require('./validations/login.schema');

router.post('/login', ValidateMiddleware(LoginValidationSchema, [ParametersConstant.BODY]), UserController.login);

module.exports = router;
