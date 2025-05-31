const express = require('express');
const { allProducts, detailProduct, createProduct, deleteProduct, updateProduct ,createReview,adminProducts} = require('../controllers/product.js');

const router = express.Router();

router.get('/products', allProducts);
router.get('/admin/products', adminProducts);
router.get('./products/:id', detailProduct);
router.post('./product/new', createProduct);
router.post('./product/newReview', createReview);
router.delete('./products/:id',deleteProduct);
router.put('./products/:id',updateProduct);

module.exports = router;
