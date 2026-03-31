const express = require('express')

const productController = require('../controllers/productController')

const upload = require('../utils/poductImageUpload')
const router = express.Router()

//product create , edit and dashboard page
router.get('/product/edit/:id', productController.vieweditProduct)
router.get('/product/create-view', productController.viewcreateProduct)
router.get('/products/dashboard', productController.viewDashboard)
router.get('/admin/dashboard-view', productController.viewadminDashboard)

router.post('/create-product', upload.single('image') ,productController.createProduct)
router.get('/products', productController.getAllProducts)
router.post('/product/update/:id', upload.single('image'), productController.updateProduct)
router.post('/product/delete/:id', productController.deleteProduct);


module.exports = router