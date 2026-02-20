const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("Server working");
});

// Webhook verification (hardcoded token for now)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "desilife123") {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});