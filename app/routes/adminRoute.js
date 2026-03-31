const express = require('express')

const AdminController = require('../controllers/adminController')

const router = express.Router()

router.get('/register-view', AdminController.userRegisterview)
router.post('/user/register', AdminController.userRegister)




module.exports = router