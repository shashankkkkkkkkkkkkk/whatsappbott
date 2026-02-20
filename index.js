const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/*
====================================
MULTI-CLIENT CONFIG
====================================
In future you can move this to DB.
For now we keep it structured.
*/

const clients = {
  desilife: {
    name: "Desi Life Milk",
    systemPrompt: `
You are a premium WhatsApp sales assistant for Desi Life Milk.

Business Details:
- They sell A2 Desi Cow Milk.
- Fresh farm milk delivered to homes.
- Focus on purity, health, and premium quality.
- Offer daily and monthly subscriptions.
- Home delivery available.

Rules:
- Reply short and confident.
- Encourage subscriptions naturally.
- Be premium but friendly.
`
  }
};

/*
====================================
ROOT
====================================
*/
app.get("/", (req, res) => {
  res.send("AI WhatsApp Bot Running 🚀");
});

/*
====================================
WEBHOOK VERIFICATION
====================================
*/
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/*
====================================
DUPLICATE MESSAGE PROTECTION
====================================
*/
const processedMessages = new Set();

/*
====================================
INCOMING MESSAGE HANDLER
====================================
*/
app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const messageId = message.id;

    // Prevent duplicate replies
    if (processedMessages.has(messageId)) {
      console.log("Duplicate message ignored");
      return res.sendStatus(200);
    }

    processedMessages.add(messageId);

    const from = message.from;
    const userMessage = message.text?.body;

    console.log("User:", userMessage);

    const aiReply = await generateAIReply("desilife", userMessage);

    await sendWhatsAppMessage(from, aiReply);

    console.log("Reply sent");

    res.sendStatus(200);

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

/*
====================================
AI GENERATION FUNCTION
====================================
*/
async function generateAIReply(clientKey, userMessage) {
  const client = clients[clientKey];

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: client.systemPrompt
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

/*
====================================
SEND MESSAGE TO WHATSAPP
====================================
*/
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

/*
====================================
START SERVER
====================================
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
