const mongoose = require('mongoose');


const bookedPackageSchema = mongoose.Schema({
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    email: { type: String, required: true },
    transactionId: { type: String, required: true }
});

module.exports = mongoose.model("BookedPackage", bookedPackageSchema);