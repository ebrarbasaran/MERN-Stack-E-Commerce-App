const express = require('express');
const {register, login, logout,forgetPassword, resetPassword} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logut', logout);
router.post("/password/forget-password", forgetPassword);
router.put("/password/reset-password/:token",resetPassword)


module.exports = router