const express = require('express')
const cors = require('cors')
const axios = require('axios')
const data = require('./data')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const domainArray = []

app.get('/domain', async (req, res) => {

    console.log(data.length)
    data.map((itm) => {
        if (!domainArray.includes(itm.domain)) {
            domainArray.push(itm.domain)
        }
    })
    res.send(domainArray)
})

app.get('/', (req, res) => {

    let domain = req?.query?.domain?.split(',') || []
    let availability = req?.query?.availability?.split(',') || []
    let gender = req?.query?.gender?.split(',') || []

    if (domain.length == 1 && domain[0] == '') domain = [];
    if (availability.length == 1 && availability[0] == '') availability = [];
    if (gender.length == 1 && gender[0] == '') gender = [];

    let filteredData = data.filter((itm) => (gender.includes(itm.gender) || gender.length === 0))
    // filteredData= filteredData.filter((itm) =>  (availability.includes(itm.available) || availability.length === 0) )
    filteredData = filteredData.filter((itm) => (domain.includes(itm.domain) || domain.length === 0))

    const pageNumber = req.query.page
    const limit = 20
    const offset = (pageNumber - 1) * limit
    let pagData = filteredData.slice(offset, offset + limit)
    console.log(pagData.length, filteredData.length)

    res.send({
        page: pageNumber,
        per_page: limit,
        total: pagData.length,
        data: pagData,
        total_pages: Math.ceil(filteredData.length / limit)
    })

})





app.listen(8000, (req, res) => {
    console.log("Server is Listening...")
})
