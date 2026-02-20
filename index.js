const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Verification Endpoint
app.get("/webhook", (req, res) => {
  const verify_token = "EAARTBZBJTyZCEBQscJIydwsb9vInESaIhnzIkRZAy0PZA6O9WIIGL1usiZCWCQFkaBA0EAZC1cV0dZAdzAZBCRI1XEw2N7ZAJ6vuJWBZAXoPkFQ6lnJeZA07WI2CkHW6kfhYlSjXwzv2uuvfqvZCYfn7SbUBP4zhhEUkAJ61nnywMGM3ry3u7nSZA6hLznZA0fTX9AAxhtibO8ZAzMtxidXsmUs4zfBib5HuZC2OZBt3Dsd4dcxLkNtQ5nWt0SrUxFQyoy6SavJdGrOZBaEdg4ovwnRnXv1d0yvhyl";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook for Messages
app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));