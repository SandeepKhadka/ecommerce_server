const express = require("express");
const { storeProduct, getProducts } = require("../controller/product");
const router = express.Router()
const { checkAuthorization } = require("../middleware/auth");

router.post("/api/products", checkAuthorization, storeProduct);

router.get("/api/products", getProducts);

module.exports = router