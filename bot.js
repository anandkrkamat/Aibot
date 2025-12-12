// bot.js — Telegraf long-polling Telegram -> OpenAI/AIMLAPI bridge
require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN env var');
  process.exit(1);
}

// Choose provider: set USE_AIMLAPI=true and AIMLAPI_KEY in env to use AIMLAPI.
// Otherwise it uses OpenAI with OPENAI_KEY env var.
const USE_AIMLAPI = process.env.USE_AIMLAPI === 'true';
const OPENAI_KEY = process.env.OPENAI_KEY;
const AIMLAPI_KEY = process.env.AIMLAPI_KEY;

const bot = new Telegraf(BOT_TOKEN);

// Basic commands
bot.start((ctx) => ctx.reply("Hello! Send any message to chat with the AI."));
bot.help((ctx) => ctx.reply("Just type a message and I'll reply using the AI."));

// Message handler
bot.on('text', async (ctx) => {
  const userText = ctx.message.text;
  await ctx.chat.action('typing'); // show typing

  try {
    let aiText = 'Sorry — no response from AI.';

    if (USE_AIMLAPI) {
      // AIMLAPI: adapt payload to AIMLAPI docs if needed
      const resp = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIMLAPI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "openai/gpt-5-2", // change if needed
          messages: [{ role: "user", content: userText }],
          max_tokens: 600
        })
      });
      const data = await resp.json();
      aiText = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
    } else {
      if (!OPENAI_KEY) throw new Error('OPENAI_KEY not set');
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // change to the model you want
          messages: [{ role: "user", content: userText }],
          max_tokens: 600
        })
      });
      const data = await resp.json();
      aiText = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
    }

    // Trim long replies
    const MAX = 4000;
    if (aiText.length > MAX) aiText = aiText.slice(0, MAX - 20) + "\n\n[truncated]";
    await ctx.reply(aiText);
  } catch (err) {
    console.error('Error handling message:', err);
    await ctx.reply('Sorry — there was an error processing your request.');
  }
});

// Start long-polling
(async () => {
  try {
    await bot.launch();
    console.log('Bot launched (long-polling).');
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (e) {
    console.error('Failed to launch bot:', e);
  }
})();
