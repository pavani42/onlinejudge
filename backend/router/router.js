const express = require("express");
const router = express.Router();
const { register, login } = require('../controller/user.js');

router.post('/register', register);
router.get('/login', login);

module.exports = router;