const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ===============================
// ROOT TEST
// ===============================
app.get("/", (req, res) => {
  res.send("Desi Life Milk AI WhatsApp Bot Running 🚀");
});

// ===============================
// WEBHOOK VERIFICATION
// ===============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ===============================
// HANDLE INCOMING MESSAGES
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    console.log("Incoming webhook triggered");

    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("No message found");
      return res.sendStatus(200);
    }

    const from = message.from;
    const userMessage = message.text?.body;

    console.log("User said:", userMessage);

    const aiReply = await getAIReply(userMessage);

    console.log("AI Reply:", aiReply);

    await sendWhatsAppMessage(from, aiReply);

    console.log("Reply sent successfully");

    res.sendStatus(200);

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// ===============================
// AI FUNCTION (OPENROUTER)
// ===============================
async function getAIReply(userMessage) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content: `
You are a premium WhatsApp sales assistant for Desi Life Milk.

Business Details:
- They sell A2 Desi Cow Milk.
- Fresh farm milk delivered to homes.
- Focus on purity, health, and premium quality.
- Offer daily and monthly subscriptions.
- Home delivery available.

Your Role:
- Reply short and confident.
- Sound premium but friendly.
- Encourage subscriptions naturally.
- If someone says "hi", greet and ask how you can help.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}

// ===============================
// SEND MESSAGE BACK TO WHATSAPP
// ===============================
async function sendWhatsAppMessage(to, message) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
