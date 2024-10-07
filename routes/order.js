const express = require("express");
const router = express.Router()
const { checkAuthorization, isBuyer } = require("../middleware/auth");
const { getOrders, storeOrder } = require("../controller/order");
const {createOrder, captureOrder} = require("../controller/checkout");

// CRUD OPERATION
router.get("/api/orders", getOrders);

router.post("/api/orders", checkAuthorization, isBuyer, storeOrder);

router.get("/api/orders/capture/:payerID", checkAuthorization, isBuyer, captureOrder)

module.exports = router