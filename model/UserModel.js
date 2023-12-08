const mongoose = require("../config/mongodbConfig");

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    avatar: String,
    domain: String,
    availiable: Boolean
})

const UserModel = new mongoose.model("userinfo", UserSchema)

module.exports = UserModel





