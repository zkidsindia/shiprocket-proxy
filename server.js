require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PICKUP_PINCODE = "641025";

let SHIPROCKET_TOKEN = null;

async function fetchShiprocketToken() {
  try {
    const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.SR_EMAIL,
      password: process.env.SR_PASSWORD,
    });

    SHIPROCKET_TOKEN = response.data.token;
    console.log("✅ Shiprocket token fetched.");
  } catch (err) {
    console.error("❌ Error fetching Shiprocket token:", err.response?.data || err.message);
  }
}

// Fetch token at server start
fetchShiprocketToken();

// Refresh token every 9 days (in milliseconds)
setInterval(fetchShiprocketToken, 9 * 24 * 60 * 60 * 1000); // 9 days

app.get("/check", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) return res.status(400).json({ error: "Missing pincode" });

  if (!SHIPROCKET_TOKEN) {
    return res.status(500).json({ error: "Shiprocket token not available" });
  }

  try {
    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        params: {
          pickup_postcode: PICKUP_PINCODE,
          delivery_postcode: pincode,
          cod: 0,
          weight: 0.5,
          mode: "Surface",
        },
        headers: {
          Authorization: `Bearer ${SHIPROCKET_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Shiprocket API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Shiprocket API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
