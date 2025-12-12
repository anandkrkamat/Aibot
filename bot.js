const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bot is alive ✅'));
bot.on('text', (ctx) => ctx.reply('Echo: ' + ctx.message.text));

bot.launch().then(() => console.log('Bot launched'));

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());          'Authorization': `Bearer ${AIMLAPI_KEY}`,
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
