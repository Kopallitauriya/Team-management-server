const express = require("express")
const TeamModel = require("../model/TeamModel")
const data = require('../data')

const router = express.Router();

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
    const userData = await TeamModel.find({})
    res.send(userData)

})


router.get("/:id", async (req, res) => {
    const teamid = req.params.id
    const data = TeamModel.findById(teamid)
    res.send(data)

})

router.delete("/:id",async(req,res)=>{
    try{
        const id=req.params.id
        const deleteTeam = await TeamModel.deleteOne({_id : id});
        res.send(deleteTeam)
    }catch(err){
        console.log(err);
    }
})

module.exports = router;