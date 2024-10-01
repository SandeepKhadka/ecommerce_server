var jwt = require("jsonwebtoken");
const { SELLER, BUYER, ADMIN } = require("../constants/product");

const checkAuthorization = (req, res, next) => {
  let token = req.headers.authorization?.replace("Bearer ", "");
  // let token = req.body.token;
  let isloggedIn = false;

  try {
    var decoded = jwt.verify(token, "shhhhh");
    req.user = decoded;

    isloggedIn = true;
  } catch {}

  if (isloggedIn) {
    next();
  } else {
    res.status(401).send({
      msg: "Unauthorized",
    });
  }
};

const isSeller = (req, res, next) => {
  if (req.user.role === SELLER) {
    next();
  } else {
    res.status(403).send({
      msg: "Access denied, only for sellers",
    });
  }
};

const isBuyer = (req, res, next) => {
  if (req.user.role === BUYER) {
    next();
  } else {
    res.status(403).send({
      msg: "Access denied, only for sellers",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === ADMIN) {
    next();
    console.log(req.user.role);
    
  } else {
    res.status(403).send({
      msg: "Access denied",
    });
  }
};

module.exports = {
  checkAuthorization,
  isSeller,
  isBuyer,
  isAdmin
};
