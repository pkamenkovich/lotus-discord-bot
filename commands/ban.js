const permissions = require('../utils/permissions.js')

module.exports = {
  name: 'ban',
  description: 'Bans the mentioned users if the user has permissions to do so.',
  execute: ban
}

async function ban(msg, args, state) {
  if (!permissions.checkPermission(msg, "BAN_MEMBERS")) {
    return;
  } else {
    let reasonArray = [];
    let buildReason = false;
    let reasonString = ""
    let duration = null;
    args.map((word, index) => {
      if (word === "ban") {
        buildReason = true;
      } else if(word === "list" && buildReason) {
        //list bans
      }

      if (Number.isInteger(word) && word <= 7 && word >= 0 && duration != null) {
        duration = word;
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
    })
    if (duration === null) {
      duration = 0;
    }

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
        user.ban({days: duration, reason: reasonString})
      })
    })

  }
}