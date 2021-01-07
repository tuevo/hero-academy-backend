const express = require('express');
const router = express.Router({});

router.use('/users', require('../modules/users/users.route'));
router.use('/auth', require('../modules/auth/auth.route'));

module.exports = router;
