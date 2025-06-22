const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PICKUP_PINCODE = "641025";

let tokenCache = {
  token: null,
  expiry: null,
};

// Function to login and get a new token
async function fetchShiprocketToken() {
  const email = process.env.SR_EMAIL;
  const password = process.env.SR_PASSWORD;

  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      { email, password }
    );

    const { token } = response.data;
    tokenCache.token = token;
    tokenCache.expiry = Date.now() + 8 * 24 * 60 * 60 * 1000; // Cache for 8 days
    return token;
  } catch (err) {
    console.error("Error fetching token:", err.response?.data || err.message);
    throw new Error("Failed to authenticate with Shiprocket");
  }
}

async function getValidToken() {
  if (!tokenCache.token || Date.now() > tokenCache.expiry) {
    return await fetchShiprocketToken();
  }
  return tokenCache.token;
}

app.get("/check", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) return res.status(400).json({ error: "Missing pincode" });

  try {
    const token = await getValidToken();

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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Shiprocket API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Shiprocket API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
