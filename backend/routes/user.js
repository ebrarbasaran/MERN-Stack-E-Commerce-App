const express = require('express');
const {register, login, logout,forgetPassword} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logut', logout);
router.post("/password/forget", forgetPassword);


module.exports = router