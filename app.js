require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const data = require('./data')
const TeamModel = require('./model/TeamModel')

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
    let search = req?.query?.search;
    let domain = req?.query?.domain?.split(',') || []
    let availability = req?.query?.availability?.split(',') || []
    let gender = req?.query?.gender?.split(',') || []
    let searchData = data;
    console.log(search)

    if (search) {
        const regex = new RegExp(`^${search}`, 'i')
        searchData = data.filter((itm) => regex.test(itm.first_name));
    }

    if (domain.length == 1 && domain[0] == '') domain = [];
    if (availability.length == 1 && availability[0] == '') availability = [];
    if (gender.length == 1 && gender[0] == '') gender = [];

    let filteredData = searchData.filter((itm) => (gender.includes(itm.gender) || gender.length === 0))
    filteredData= filteredData.filter((itm) =>  (availability.includes(`${itm.available}`) || availability.length === 0) )
    filteredData = filteredData.filter((itm) => (domain.includes(itm.domain) || domain.length === 0))

    const pageNumber = req.query.page
    const limit = 20
    const offset = (pageNumber - 1) * limit
    let pagData = filteredData.slice(offset, offset + limit)

    res.send({
        page: pageNumber,
        per_page: limit,
        total: pagData.length,
        data: pagData,
        total_pages: Math.ceil(filteredData.length / limit)
    })

})

app.post("/api/team", async (req, res) => {
    const body = req.body
    console.log(body)
    let teamID = body.teamID.filter((itm) => itm != '' || itm != null || itm != undefined)
    console.log(teamID)

    const users = data.filter((itm) => teamID.includes(`${itm.id}`));
   

    const check = { domain: [] };
    for (let i = 0; i < users.length; i++) {
        if (check.domain.includes(users[i].domain)) {
            res.send({ success: false, error: true, message: "People in same domain cannot be in same team " })
            return
        }
        if (!users[i].available) {
            res.send({ success: false, error: true, message: "Those who are available can only join team" })
            return
        }
        else check.domain.push(users[i].domain)
    }
    console.log(users)
    let saved = []
    if (users.length > 1) {
        
        const newTeam = new TeamModel({
            userID: users
        })
        saved = await newTeam.save()
    }
    else{
        res.send({ success: false, error: true, message: "Atleast 2 members are required to create a team" })
        return
    }


    res.send({ success: true, error: false, message: saved })
})

app.get("/api/team", async (req, res) => {
    const userData = await TeamModel.find({})
    res.send(userData)

})


app.get("/api/team/:id", async (req, res) => {
    const teamid = req.params.id
    const data = TeamModel.findById(teamid)
    res.send(data)

})

app.delete("/api/team/:id",async(req,res)=>{
    try{
        const id=req.params.id
        const deleteTeam = await TeamModel.deleteOne({_id : id});
        res.send(deleteTeam)
    }catch(err){
        console.log(err);
    }
})




app.listen(8000, (req, res) => {
    console.log("Server is Listening...")
})
