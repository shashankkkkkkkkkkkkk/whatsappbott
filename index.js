const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ====================================
   CLIENT CONFIG (Scalable Structure)
==================================== */

const clients = {
  desilife: {
    systemPrompt: `
You are a premium WhatsApp sales assistant for Desi Life Milk.

Business:
- A2 Desi Cow Milk
- Farm fresh, chemical-free
- Home delivery
- Daily & monthly subscriptions
- Focus on purity and health

Rules:
- Do NOT repeat greetings in same conversation.
- Continue conversation naturally.
- Be short, clear and confident.
- Guide user toward subscription.
- If user already greeted, do not greet again.
`
  }
};

/* ====================================
   MEMORY + DUPLICATE PROTECTION
==================================== */

const processedMessages = new Set();
const conversations = {};

/* ====================================
   ROOT
==================================== */

app.get("/", (req, res) => {
  res.send("AI WhatsApp Bot Running 🚀");
});

/* ====================================
   WEBHOOK VERIFICATION
==================================== */

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* ====================================
   WEBHOOK HANDLER
==================================== */

app.post("/webhook", async (req, res) => {
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    // Ignore non-message events (like delivery receipts)
    if (!value?.messages) {
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const messageId = message.id;

    // Prevent duplicate replies
    if (processedMessages.has(messageId)) {
      return res.sendStatus(200);
    }

    processedMessages.add(messageId);

    const from = message.from;
    const userMessage = message.text?.body;

    if (!userMessage) return res.sendStatus(200);

    console.log("User:", userMessage);

    // Initialize conversation if not exists
    if (!conversations[from]) {
      conversations[from] = [];
    }

    conversations[from].push({
      role: "user",
      content: userMessage
    });

    const aiReply = await generateAIReply("desilife", conversations[from]);

    conversations[from].push({
      role: "assistant",
      content: aiReply
    });

    await sendWhatsAppMessage(from, aiReply);

    res.sendStatus(200);

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

/* ====================================
   AI GENERATION
==================================== */

async function generateAIReply(clientKey, messageHistory) {
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
        ...messageHistory
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

/* ====================================
   SEND MESSAGE TO WHATSAPP
==================================== */

async function sendWhatsAppMessage(to, message) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
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

/* ====================================
   START SERVER
==================================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
