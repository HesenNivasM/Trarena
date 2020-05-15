const express = require('express');
const { createUser, loginUser, logoutUser } = require('../controllers/users');

const router = express.Router();

router.route('/create-user').post(createUser);
router.route('/login-user').post(loginUser);
router.route('/logout-user').post(logoutUser);

module.exports = router;
