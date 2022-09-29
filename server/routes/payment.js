const router = require("express").Router();
const moment = require("moment");
const verifyToken = require("../middlewares/verify-token");
const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE);
const Order = require("../models/order");
secretKey = process.env.PAYSTACK;
const SHIPMENT = {
  store: {
    price: 0,
    days: 1,
  },
  normal: {
    price: 500,
    days: 7,
  },
  fast: {
    price: 1000,
    days: 3,
  },
};

function shipmentPrice(shipmentOption) {
  let estimated = moment()
    .add(shipmentOption.days, "d")
    .format("dddd DD MMMM YYYY");

  return { estimated, price: shipmentOption.price };
}

router.post("/shipment", (req, res) => {
  let shipment;
  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else if (req.body.shipment === "store") {
    shipment = shipmentPrice(SHIPMENT.store);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({ success: true, shipment: shipment });
});

router.post("/payment/integration", async (req, res) => {
  let headers = {
    Authorization: `Bearer ${secretKey}`,
    "content-type": "application/json",
  };

  let body = {
    email: req.body.email,
    amount: req.body.amount,
    callback_url: "http://localhost:4000/api/paystack/verify",
  };

  await axios
    .post("https://api.paystack.co/transaction/initialize", body, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    })
    .then((response) => {
      return res.json(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/paystack/verify", verifyToken, async (req, res) => {
  try {
    reference = req.body.reference;

    const result = axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,

      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    let order = new Order();
    let cart = req.body.cart;

    cart.map((product) => {
      order.products.push({
        productID: product._id,
        quantity: parseInt(product.quantity),
        price: product.orderPrice,
        size: product.orderSize,
      });
    });
    console.log(req.body.estimatedDelivery);
    order.user = req.decoded._id;
    order.estimateDelivery = req.body.estimatedDelivery;
    order.status = "Paid";
    order.total = req.body.total;
    order.receiver = "632b47a5f6ee33ebe9600d45";
    order.quantityBought = req.body.quantityBought;
    order.payment = "Online payment";
    await order.save();

    res.json({
      success: true,
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/stripe/payment", verifyToken, async (req, res) => {
  console.log(req.body);
  stripe.customers
    .create({
      email: req.decoded.email,
    })
    .then((customer) => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa",
      });
    })
    .then((source) => {
      return stripe.charges.create({
        amount: req.body.total,
        currency: "usd",
        customer: source.customer,
      });
    })
    .then(async (charge) => {
      let order = new Order();
      console.log(req.body);
      let cart = req.body.cart;

      cart.map((product) => {
        order.products.push({
          productID: product._id,
          quantity: parseInt(product.quantity),
          price: product.orderPrice,
          size: product.orderSize,
        });
      });

      order.user = req.decoded._id;
      order.estimateDelivery = req.body.estimatedDelivery;
      order.status = "Paid";
      order.total = req.body.total;
      order.receiver = "632b494ef6ee33ebe9600d47";
      order.payment = "Online payment";
      order.quantityBought = req.body.quantityBought;
      await order.save();

      res.json({
        success: true,
        message: "Successfully made a payment",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "eur",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });
module.exports = router;
