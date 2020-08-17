module.exports = {
    name: 'ban',
    description: 'Bans the mentioned users if the user has permissions to do so.',
    execute(msg, args) {
      if(!msg.author.hasPermission("BAN_MEMBERS")) {
        return;
      } else {
        msg.mentions.users.map( (user) => {
          user.ban({reason: args.toString()});
        });
      }
    },
  };