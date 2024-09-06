const express = require("express");
const { storeProduct, getProducts, deleteProduct, updateProduct } = require("../controller/product");
const router = express.Router()
const { checkAuthorization, isSeller } = require("../middleware/auth");

// CRUD OPERATION
router.get("/api/products", getProducts);

router.post("/api/products", checkAuthorization, isSeller, storeProduct);
router.put("/api/products/:id", checkAuthorization, isSeller, updateProduct);
router.delete("/api/products/:id", checkAuthorization, isSeller, deleteProduct);


module.exports = router