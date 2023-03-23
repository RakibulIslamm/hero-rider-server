const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    profile_img: { type: String, required: true },
    drivingLicense: { type: String },
    nid_card: { type: String, required: true },
    car_info: { type: String, required: true },
    vehicle_type: { type: String, required: true },
    user_type: { type: String, required: true },
    area: { type: String, required: true },
    blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);