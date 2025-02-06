const mongoose = require('mongoose')

const servicesSchema = new mongoose.Schema({

    serviceName: {
        type: String,
    },
    slug: {
        type: String,
    },
    serviceIcon: [],
    date: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Service", servicesSchema)