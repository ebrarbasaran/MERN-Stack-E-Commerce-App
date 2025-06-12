const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLenght: 6
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user",
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{timestamps: true})

module.exports = mongoose.model('User', userSchema)