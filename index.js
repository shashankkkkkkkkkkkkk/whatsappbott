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

    // Get AI reply
    const aiReply = await getGeminiReply(userMessage);

    console.log("AI Reply:", aiReply);

    // Send reply back to WhatsApp
    await sendWhatsAppMessage(from, aiReply);

    console.log("Reply sent successfully");

    res.sendStatus(200);

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// ===============================
// GEMINI AI FUNCTION
// ===============================
async function getGeminiReply(userMessage) {
  const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `
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
- Answer pricing, delivery, and product questions clearly.
- If someone just says "hi", greet and ask how you can help.

Customer message: ${userMessage}
`
            }
          ]
        }
      ]
    }
  );

  return response.data.candidates[0].content.parts[0].text;
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

// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
