const express = require('express');
const {register, login, logout,forgetPassword, resetPassword, userDetail} = require('../controllers/user');
const { authenticationMid } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logut', logout);
router.post("/forget-password", forgetPassword);
router.put("/reset-password/:token",resetPassword);
router.get('/me' ,authenticationMid ,userDetail);

module.exports = router