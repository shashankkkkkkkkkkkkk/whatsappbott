const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("NEW CODE WORKING");
});

app.get("/webhook", (req, res) => {
  res.send("WEBHOOK HIT");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});