const express = require("express");
const router = express.Router()
const { checkAuthorization, isBuyer } = require("../middleware/auth");
const { getOrders, storeOrder } = require("../controller/order");

// CRUD OPERATION
router.get("/api/orders", getOrders);

router.post("/api/orders", checkAuthorization, isBuyer, storeOrder);


module.exports = router