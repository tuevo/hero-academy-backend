const express = require('express');
const router = express.Router({});

const UserController = require('./users.controller');
const ParametersConstant = require('../../constants/parameters.constant');
const ValidateMiddleware = require('../../middleware/validate.middleware');

// const {LoginValidationSchema} = require('./validations/login.schema');

// router.post('/login', ValidateMiddleware(LoginValidationSchema, [ParametersConstant.BODY]), UserController.login);

module.exports = router;
