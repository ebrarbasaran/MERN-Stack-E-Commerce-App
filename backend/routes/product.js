const express = require('express');
const { allProducts, detailProduct, createProduct, deleteProduct, updateProduct, createReview, adminProducts } = require('../controllers/product.js');
const { authenticationMid, isAdmin } = require('../middlewares/auth.js');

const router = express.Router();

router.get('/products', allProducts);
router.get('/admin/products',authenticationMid, isAdmin, adminProducts);
router.get('/products/:id', detailProduct);
router.post('/product/new', authenticationMid, isAdmin, createProduct);
router.post('/product/newReview',authenticationMid, createReview);
router.delete('/products/:id',authenticationMid, isAdmin, deleteProduct);
router.put('/products/:id',authenticationMid, isAdmin, updateProduct);

module.exports = router;
