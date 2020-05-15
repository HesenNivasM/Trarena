const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: String,
    jobType: String,
    password: String,
    loggedIn: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);
