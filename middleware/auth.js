var jwt = require("jsonwebtoken");
const { SELLER, BUYER } = require("../constants/product");

const checkAuthorization = (req, res, next) => {
    let token = req.headers.authorization?.replace("Bearer ", "");
    let isloggedIn = false;
  
    try {
      var decoded = jwt.verify(token, "shhhhh");
      req.user = decoded
    //   console.log(req.user);
      
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

  const isSeller = (req, res, next)=>{
    if(req.user.role === SELLER){
      next()
    }else{
      res.status(403).send({
        msg : "Access denied, only for sellers"
      })
    }
  }

  const isBuyer = (req, res, next)=>{
    if(req.user.role === BUYER){
      // next()
    }
    // else{
    //   res.status(403).send({
    //     msg : "Access denied, only for sellers"
    //   })
    // }
  }


module.exports = {
    checkAuthorization,
    isSeller
}