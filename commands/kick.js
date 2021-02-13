const permissions = require('../utils/permissions.js')

module.exports = {
  name: 'kick',
  description: 'Kicks the mentions list provided they have permission to do so.',
  execute: kick
}

async function kick(msg, args, state) {
  if (!permissions.checkPermission(msg, "KICK_MEMBERS")) {
    return;
  } else {
    let reasonArray = [];
    let reasonString = "";
    let buildReason = false;
    args.map((word) => {
      if (word === "kick") {
        buildReason = true;
      }
      if (buildReason) {
        reasonArray.push(word);
      }
    });
    reasonArray.map((word, index) => {
      reasonString = reasonString.concat(word)
      if (index < reasonArray.length - 1) {
        reasonString = reasonString.concat(" ")
      }
    });
    let guild = msg.guild;
    let filteredMentions = msg.mentions.users.filter((user) => {
      if(!user.bot) {
        return user;
      }
    });
    
    let userPromiseArray = [];
    filteredMentions.keyArray().map((key) => {
      let user = filteredMentions.get(key);
      userPromiseArray.push(guild.members.fetch(user))
    })

    Promise.all(userPromiseArray).then((users) => {
      users.map(user => {
        user.kick(reasonString);
      })
    });
  }
}