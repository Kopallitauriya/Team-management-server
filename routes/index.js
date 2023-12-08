const express = require("express")
const TeamRouter = require("./team.route")
const UserRouter = require("./user.route")

const router = express.Router();

router.use('/user', UserRouter)
router.use('/team', TeamRouter)

module.exports = router;