const express = require('express');
const { allProducts, detailProduct, createProduct, deleteProduct, updateProduct, createReview, adminProducts } = require('../controllers/product.js');
const { authenticationMid, isAdmin } = require('../middlewares/auth.js');

const router = express.Router();

router.get('/products', allProducts);
router.get('/admin/products',authenticationMid, isAdmin("admin"), adminProducts);
router.get('./products/:id', detailProduct);
router.post('./product/new', authenticationMid, isAdmin("admin"), createProduct);
router.post('./product/newReview',authenticationMid, createReview);
router.delete('./products/:id',authenticationMid, isAdmin("admin"), deleteProduct);
router.put('./products/:id',authenticationMid, isAdmin("admin"), updateProduct);

module.exports = router;
