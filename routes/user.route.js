const express = require("express")
const UserModel = require("../model/UserModel")
const mockdata = require("../data")

const router = express.Router();

router.get('/domain', async (req, res) => {
    const domainArray = await UserModel.distinct('domain', {});
    res.send(domainArray)
})

router.get('/filter', async (req, res) => {
    let search = req?.query?.search;
    let domain = req?.query?.domain?.split(',') || []
    let availability = req?.query?.availability?.split(',') || []
    let gender = req?.query?.gender?.split(',') || []

    const data = await UserModel.find({});
    let searchData = data;

    if (search) {
        const regex = new RegExp(`^${search}`, 'i')
        searchData = data.filter((itm) => regex.test(itm.first_name));
    }

    if (domain.length == 1 && domain[0] == '') domain = [];
    if (availability.length == 1 && availability[0] == '') availability = [];
    if (gender.length == 1 && gender[0] == '') gender = [];

    let filteredData = searchData.filter((itm) => (gender.includes(itm.gender) || gender.length === 0))
    console.log('filteredData', filteredData.length)
    filteredData= filteredData.filter((itm) =>  (availability.includes(`${itm.availiable}`) || availability.length === 0) )
    console.log('filteredData', filteredData.length)
    filteredData = filteredData.filter((itm) => (domain.includes(itm.domain) || domain.length === 0))

    // pagination
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

router.get('/', async (req,res) => {
    const pageNumber = req.query.page
    
    const userdata = await UserModel.find({});
    
    // pagination
    const limit = 20
    const offset = (pageNumber - 1) * limit
    let pagData = userdata.slice(offset, offset + limit)
      res.send({
        page: pageNumber,
        per_page: limit,
        total: pagData.length,
        data: pagData,
        total_pages: Math.ceil(filteredData.length / limit)
    })
})

router.get('/:id', async (req,res) => {
    const id = req.params.id;
    const userdata = await UserModel.findById(id);
    res.send(userdata);
})

router.post('/', async (req,res) => {
    const body = req.body;
    const newUser = new UserModel(body);
    res.send(await newUser.save());
})

router.put('/:id', async (req,res) => {
    const body = req.body;
    const updatedUser = await UserModel.update({_id: id}, {$set : body})
    res.send(updatedUser);
})

router.delete('/:id', async (req,res) => {
    res.send(await UserModel.delete({_id: id}))
})

router.get('/save/mockusers', async (req,res) => {
    mockdata.forEach(async (itm) => {
        const newUser = new UserModel({
            first_name: itm.first_name,
            last_name: itm.last_name,
            email: itm.email,
            gender: itm.gender,
            avatar: itm.avatar,
            domain: itm.domain,
            availiable: itm.available
        })
        console.log(await newUser.save());
    })
    res.send("Saved All Users!");
})


module.exports = router;