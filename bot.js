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

bot.start((ctx) => ctx.reply('🤖 Bot is alive! Send a message.'));
bot.help((ctx) => ctx.reply('Just type a message and I will reply using OpenAI.'));

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
        messages: [{ role: 'user', content: userText }],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.error('OpenAI error:', data);
      return ctx.reply('❌ OpenAI API error');
    }

    const reply = data.choices[0].message.content;
    await ctx.reply(reply);
  } catch (err) {
    console.error('Runtime error:', err);
    await ctx.reply('❌ Error contacting OpenAI');
  }
});

bot.launch().then(() => {
  console.log('✅ Bot launched (OpenAI)');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));      aiText = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
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
