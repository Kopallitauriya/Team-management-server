const mongoose = require("../config/mongodbConfig");

const TeamSchema = new mongoose.Schema({
    userID: [Object]
})

const TeamModel = new mongoose.model("teaminfo", TeamSchema)
module.exports = TeamModel





