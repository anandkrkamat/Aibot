import 'dotenv/config';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('✅ Bot is alive');
});

bot.on('text', (ctx) => {
  ctx.reply('ECHO: ' + ctx.message.text);
});

bot.launch();
console.log('Bot started');          { role: 'user', content: userText }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('OpenAI response error:', data);
      await ctx.reply('❌ OpenAI returned an error');
      return;
    }

    const reply = data.choices[0].message.content;
    await ctx.reply(reply);

  } catch (err) {
    console.error('Runtime error:', err);
    await ctx.reply('❌ Error contacting OpenAI');
  }
});

// Launch bot
bot.launch().then(() => {
  console.log('✅ Bot launched successfully');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));          { role: 'user', content: userText }
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
