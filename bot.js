import 'dotenv/config';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

// Create Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// /start command
bot.start((ctx) => {
  ctx.reply('🤖 Bot is alive! Send any message.');
});

// Handle normal text
bot.on('text', async (ctx) => {
  const userText = ctx.message.text;
  console.log('USER:', userText);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: userText }
      ],
    });

    const reply = completion.choices[0].message.content;
    await ctx.reply(reply);

  } catch (error) {
    console.error('OPENAI ERROR:', error);

    // Send readable error back
    await ctx.reply(
      '❌ OpenAI error:\n' +
      (error?.error?.message || error?.message || 'Unknown error')
    );
  }
});

// Start bot
bot.launch();
console.log('✅ Bot started');
