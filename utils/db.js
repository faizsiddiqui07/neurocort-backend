const mongoose = require('mongoose')
const db_connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Local database connected");

    } catch (error) {
        console.log(error);
    }
}

module.exports = db_connect