export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  botToken: (process.env.BOT_TOKEN ?? '').trim(),
});
