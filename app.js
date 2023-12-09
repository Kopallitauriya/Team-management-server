require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', router)

app.get('/', (req, res) => {
    res.send("Health Check OK!");
})

app.listen(8000, (req, res) => {
    console.log("Server is Listening...")
})

// module.exports = app;