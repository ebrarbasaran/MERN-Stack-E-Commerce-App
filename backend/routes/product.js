const express = require('express');
const { allProducts, detailProduct, createProduct, deleteProduct, updateProduct, createReview, adminProducts } = require('../controllers/product.js');
const { authenticationMid, authorizeRoles } = require('../middlewares/auth.js');

const router = express.Router();

router.get('/products', allProducts);
router.get('/admin/products', authenticationMid, authorizeRoles("admin"), adminProducts);
router.get('/products/:id', detailProduct);
router.post('/product/new', authenticationMid, authorizeRoles("admin"), createProduct);
router.post('/product/newReview', authenticationMid, createReview);
router.delete('/products/:id', authenticationMid, authorizeRoles("admin"), deleteProduct);
router.put('/products/:id', authenticationMid, authorizeRoles("admin"), updateProduct);

module.exports = router;
