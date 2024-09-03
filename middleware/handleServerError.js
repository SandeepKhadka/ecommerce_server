const handleServerError = (error, req, res, next) => {
  // todo - fix the structure of error
  console.error(error);
  
  if (error.name === "ValidationError") {
    return res.status(400).send({
      msg: "Bad request",
      error: error.errors,
    });
  }
  res.status(500).send({ msg: "server error" });
};


module.exports = handleServerError