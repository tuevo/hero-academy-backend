const express = require('express');
const router = express.Router({});

router.use('/users', require('../modules/users/users.route'));
router.use('/auth', require('../modules/auth/auth.route'));
router.use(
  '/category-clusters',
  require('../modules/category-clusters/category-clusters.route')
);

module.exports = router;
