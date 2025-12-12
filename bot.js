require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_KEY = process.env.OPENAI_KEY;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is missing');
}

if (!OPENAI_KEY) {
  throw new Error('OPENAI_KEY is missing');
}

const bot = new Telegraf(BOT_TOKEN);

// Commands
bot.start((ctx) => ctx.reply('🤖 Bot is alive! Send a message.'));
bot.help((ctx) => ctx.reply('Just type a message and I will reply using OpenAI.'));

// Message handler
bot.on('text', async (ctx) => {
  const userText = ctx.message.text;
  await ctx.chat.action('typing');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: userText }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('OpenAI response error:', data);
      return ctx.reply('❌ OpenAI error');
    }

    const reply = data.choices[0].message.content;
    await ctx.reply(reply);

  } catch (error) {
    console.error('Runtime error:', error);
    await ctx.reply('❌ Error contacting OpenAI');
  }
});

// Launch bot
bot.launch().then(() => {
  console.log('✅ Bot launched successfully');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.on('text', async (ctx) => {
  console.log('TEXT RECEIVED:', ctx.message.text); // 👈 ADD THIS LINE
  const userText = ctx.message.text;
  await ctx.chat.action('typing');
