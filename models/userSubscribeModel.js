const mongoose = require('mongoose')

const userSubscribe = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model("subscription", userSubscribe)