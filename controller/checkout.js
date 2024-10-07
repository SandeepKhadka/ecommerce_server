require("dotenv").config();
const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../model/Order");

// Creating an environment
let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.SECRET_KEY;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
  intent: "CAPTURE",
  purchase_units: [
    {
      amount: {
        currency_code: "USD",
        value: "100.00",
      },
    },
  ],
});

// Call API with your client and get a response for your call
const createOrder = async function (req, res) {
  try {
    let response = await client.execute(request);
    res.status(200).send(response.result);
  } catch (err) {
    res.send(err);
  }
};

const captureOrder = async function (req, res) {
  try {
    if (!req.params.payerID) {
      return res.status(404).send("Order id not found");
    }
    request = new paypal.orders.OrdersCaptureRequest(req.params.payerID);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    let order = await Order.findOneAndUpdate(
      { order_id: req.params.payerID },
      { paymentStatus: "Paid" },
      { new: true } 
    );
    console.log(order);
    
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

module.exports = {
  createOrder,
  captureOrder,
};
