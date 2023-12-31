const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log("mongoDB connected succesfully") })
.catch((err) => { console.log(err) })

module.exports = mongoose