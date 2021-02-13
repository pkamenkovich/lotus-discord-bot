module.exports = {
    name: 'mute',
    description: 'Mutes whoever is on the mentions the bot by replacing the text that the user provides with a generic message',
    execute(msg, args, state) {
      //Check permissions
      //Populate a map of guilds to users
      //For each mentioned user, check them inside the muted state.
      let guild = msg.guild;
      if(!state.muted.has(guild.id)) {
        state.muted.set(guild.id, []);
      } else {
        state.muted.get(guild.id).includes(guild.members.fetch(msg.author.id));
      }
    },
  };