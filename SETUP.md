# 🚀 WhatsApp Automation Bot - Live Setup Guide

## 📋 Prerequisites

1. **WhatsApp Business Account** ✓ (You already have: +1 (555) 163-5237)
2. **Meta/Facebook App** - For WhatsApp Business API
3. **Render Account** - For hosting (already deployed)
4. **OpenRouter API Key** - For AI responses

---

## 🔧 Step 1: Set Up WhatsApp Business API

### 1.1 Go to Meta Developer Console
- Visit: https://developers.facebook.com/
- Create/Select your app

### 1.2 Get Your Tokens
1. **Phone Number ID**: Settings > Phone Numbers > Copy ID
2. **WhatsApp Token**: Whatsapp Business Platform > API Setup > Generate Token
3. **Verify Token**: Create a custom token (e.g., `secure_random_token_123`)

### 1.3 Set Webhook in Meta Dashboard
- **Webhook URL**: `https://your-render-url.onrender.com/webhook`
- **Verify Token**: Same as `VERIFY_TOKEN` env variable
- **Subscribe to Fields**: `messages`, `message_status`

---

## 🤖 Step 2: Get OpenRouter API Key

1. Visit: https://openrouter.ai/
2. Sign up / Log in
3. Go to Dashboard > API Keys
4. Create new API key
5. Copy the key

---

## 📦 Step 3: Configure Environment Variables on Render

1. Go to your Render project
2. Click **Environment** in the sidebar
3. Add these variables:

```
VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_TOKEN=EAAxxxxxxxxxx...
PHONE_NUMBER_ID=1234567890123456
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx...
DEFAULT_CLIENT=toniguy
```

**Note**: Make sure the `VERIFY_TOKEN` matches what you set in Meta Dashboard!

---

## 🔗 Step 4: Connect WhatsApp to Your Bot

1. Go to WhatsApp Business Platform Settings
2. Webhook Settings:
   - **Callback URL**: `https://your-render-url.onrender.com/webhook`
   - **Verify Token**: Your `VERIFY_TOKEN`
3. Click "Verify and Save"
4. Subscribe to webhook events

---

## ✅ Step 5: Test It Live!

Send a WhatsApp message to your business account number:

**Send**: "Hi, what are your services?"

**Expected Response** (TONI&GUY):
```
Welcome to TONI&GUY Gokul Plots!

We offer:
- Haircuts: ₹500 - ₹2,000
- Hair Coloring: ₹2,000 - ₹5,000
- Facials: ₹1,500 - ₹3,000
...
```

---

## 🔄 Supported Clients

### 1. **desilife** - Desi Life Milk
- Agricultural product sales
- Subscription-focused

### 2. **toniguy** - TONI&GUY Salon
- Haircut & styling bookings
- Service recommendations
- Bridal makeup consultations

---

## 📊 Dashboard

View the interactive demo:
- **Local**: http://localhost:3000/
- **Render**: `https://your-render-url.onrender.com/`

---

## 🐛 Troubleshooting

### Bot Not Responding?
1. Check Render logs: `Deployments > Logs`
2. Verify all environment variables are set
3. Check WhatsApp token is valid
4. Ensure webhook URL is correct

### Webhook Verification Failed?
- Confirm `VERIFY_TOKEN` matches exactly in Meta Dashboard
- Make sure webhook URL is publicly accessible

### No AI Response?
- Check OpenRouter API key is valid
- Verify model name: `openai/gpt-3.5-turbo`
- Check API usage/credits

---

## 🚀 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Meta Developer Console**: https://developers.facebook.com
- **WhatsApp Business API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **OpenRouter Docs**: https://openrouter.ai/docs

---

## 📱 Your Business Number

**TONI&GUY Gokul Plots**
- Number: +1 (555) 163-5237
- Location: Gokul Plots, Hyderabad
- Automation: ✅ Live

---

**Status**: 🟢 Ready for Live WhatsApp Messages!
