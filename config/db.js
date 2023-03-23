const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://rakibsDb:fJJZkwi2FY00NcT9@cluster0.qspqh.mongodb.net/hero-rider');
        console.log(`Mongodb Connected: ${conn.connection.host}`.bgCyan.underline)
    }
    catch (e) {
        console.log(e.message)
    }
}

module.exports = connectDB;