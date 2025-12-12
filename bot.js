import 'dotenv/config';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

bot.start((ctx) => {
  ctx.reply('🤖 Bot is alive! Send any message.');
});

bot.on('text', async (ctx) => {
  try {
    const userText = ctx.message.text;
    console.log('TEXT:', userText);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: userText }
      ]
    });

    await ctx.reply(response.choices[0].message.content);

  } catch (error) {
    console.error(error);
    await ctx.reply('❌ Error contacting OpenAI');
  }
});

bot.launch();
console.log('Bot started with OpenAI');
