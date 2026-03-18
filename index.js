const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51T6qHmRIBgXxh7a1QODy01FDhjj4Wc8azMvnAritOml5bAPJ3zlxQWjMWnq7d5tU5lrTMAep0ABUCdY03cSrk37S00azXZ6KGw");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { amount, itemName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: itemName || "Harvest Havens Booking",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
     success_url: "https://joshuairuobe.github.io/HarvesthaveBusiness/book-now.html?payment=success&test=NEW",
cancel_url: "https://joshuairuobe.github.io/HarvesthaveBusiness/book-now.html?payment=cancelled",
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});
