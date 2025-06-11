const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const SHIPROCKET_TOKEN = process.env.SHIPROCKET_TOKEN;
const PICKUP_PINCODE = "641025";

app.get("/check", async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) return res.status(400).json({ error: "Missing pincode" });

  try {
    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        params: {
          pickup_postcode: PICKUP_PINCODE,
          delivery_postcode: pincode,
          cod: 0,
          weight: 0.5,
          mode: 'Surface',
        },
        headers: {
          Authorization: `Bearer ${SHIPROCKET_TOKEN}`,
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
