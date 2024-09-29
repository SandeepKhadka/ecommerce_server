const express = require("express");
const handleServerError = require("./middleware/handleServerError.js");
require("./config/database.js");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const fileUpload = require("express-fileupload")
const app = express();
const cors = require("cors")

app.use(express.json()); // global middleware, runs in every routes, sets up data in request.body
app.use(fileUpload())
app.use(express.static('uploads'))
app.use(cors())

app.use(authRoutes)
app.use(productRoutes)
app.use(orderRoutes)
// app.use()




app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});

app.use(handleServerError);

app.listen(8000, () => {
  console.log("server started....");
});
