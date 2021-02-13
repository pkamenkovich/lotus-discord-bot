const permissions = require('../utils/permissions.js')

module.exports = {
  name: 'unban',
  description: 'Unbans the mentioned users if the user has permissions to do so.',
  execute: unban
}

async function unban(msg, args, state) {
  if (!permissions.checkPermission(msg, "BAN_MEMBERS")) {
    return;
  } else {
    let guild = msg.guild;
    let bans = await guild.fetchBans();
    let mentions = msg.mentions.users;
    mentions.map(mention => {
        bans.map(ban => {
            if(ban.user.id == mention.id) {
                
            }
        })
    })
  }
}