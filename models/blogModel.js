const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

    blogTitle: {
        type: String,
    },
    slug: {
        type: String,
    },
    blogImage: [],
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

module.exports = mongoose.model("Blog", blogSchema)