const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: null,
    },
    lastname: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    solvedQuestions: [{
        type: String
    }],
    totalSubmissions: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("user", userSchema);