const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===============================
// ROOT ROUTE (for testing)
// ===============================
app.get("/", (req, res) => {
  res.send("WhatsApp Bot Running 🚀");
});

// ===============================
// WEBHOOK VERIFICATION
// ===============================
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "desilife123"; // must match Meta dashboard

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ===============================
// RECEIVE MESSAGES
// ===============================
app.post("/webhook", async (req, res) => {
  console.log("Incoming message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ===============================
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
