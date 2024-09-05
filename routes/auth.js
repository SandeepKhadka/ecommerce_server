const express = require("express");
const { login, signup } = require("../controller/auth");
const router = express.Router()


router.post("/api/login", login);

router.post("/api/signup", signup);

module.exports = router