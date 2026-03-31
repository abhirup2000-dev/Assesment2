const express = require('express')

const router = express.Router()


const AdminRoute = require('./adminRoute')
const ProductRoute = require('./productRoute')


router.use(AdminRoute)
router.use(ProductRoute)


module.exports = router