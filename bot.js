import 'dotenv/config';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

bot.start((ctx) => ctx.reply('🤖 Bot is alive. Send any message.'));
bot.help((ctx) => ctx.reply('Just type something.'));

bot.on('text', async (ctx) => {
  try {
    const userText = ctx.message.text;
    console.log('TEXT:', userText);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userText }]
    });

    await ctx.reply(completion.choices[0].message.content);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Error talking to OpenAI');
  }
});

bot.launch();
console.log('✅ Bot started');          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('OpenAI error:', data);
      return ctx.reply('❌ OpenAI returned an error');
    }

    await ctx.reply(data.choices[0].message.content);

  } catch (err) {
    console.error('Runtime error:', err);
    await ctx.reply('❌ Error contacting OpenAI');
  }
});

// Launch bot
bot.launch().then(() => console.log('✅ Bot launched successfully'));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));      method: 'POST',
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
