module.exports = {
    name: 'ping',
    description: 'A ping command to make sure the bot is responsive.',
    execute(msg, args) {
      msg.reply('pong');
    },
  };