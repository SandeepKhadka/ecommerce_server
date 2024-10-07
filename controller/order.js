require("dotenv").config();
const Order = require("../model/Order");
const Product = require("../model/Product");

const paypal = require("@paypal/checkout-server-sdk");

// Creating an environment
let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.SECRET_KEY;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();

const getOrders = async (req, res, next) => {
  try {
    let orders = await Order.find({
      $nor: [{ paymentMethod: "paypal", paymentStatus: "Unpaid" }],
    }).populate("createdBy", "name email");

    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const storeOrder = async (req, res, next) => {
  try {
    const {
      products: orderProducts,
      shipping_address,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!shipping_address && !paymentMethod) {
      res.status(400).send("Shipping details and payment method is required");
    }
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPrice,
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/",
        cancel_url: "http://localhost:5173/",
      },
    });

    let products = [];
    for (let index = 0; index < orderProducts.length; index++) {
      let element = orderProducts[index];

      let db_product = await Product.findOne({ _id: element._id });
      // console.log(db_product);

      products.push({
        ...db_product.toObject(),
        quantity: element.quantity,
      });
    }
    let paypalResponse;
    let order_id = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    if (paymentMethod == "paypal") {
      try {
        paypalResponse = await client.execute(request);
        order_id = paypalResponse.result.id;
        // if (response) res.status(200).send(response.result);
      } catch (err) {
        res.send(err);
      }
    }


    let orders = await Order.create({
      products,
      createdBy: req.user._id,
      shipping_address,
      paymentMethod,
      order_id,
    });

    if(paypalResponse){
      return res.send(paypalResponse.result);
    }

    return res.send(orders)

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  storeOrder,
};
