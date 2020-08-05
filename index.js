require('dotenv').config();
const Discord = require('discord.js');
const lotus = new Discord.Client();
lotus.commands = new Discord.Collection();
const botCommands = require('./commands');
let guildRateSet = new Map();
let rateLimit = 5;
let slowModeTimer = 10;
let tick = false;
let severity = 1;

Object.keys(botCommands).map(command => {
    lotus.commands.set(botCommands[command].name, botCommands[command]);
});

const TOKEN = process.env.TOKEN;

lotus.login(TOKEN);

lotus.on('ready', () => {
    console.info(`Logged in as ${lotus.user.tag}!`);
});

lotus.on('message', msg => {
    if(guildRateSet.get(msg.channel.id) != null) {
        guildRateSet.add(msg.channel.id, new Set())
    }
    if(!msg.member.hasPermission("ADMINISTRATOR")) {
        //If the user is not an admin, we should start tracking the channel rate.
        let channelRate = guildRateSet.get(msg.channel.id);
        
        channelRate.size() > 0 ? tick = false : tick = true;
        if(tick) {
            setTimeout( () => {
                channelRate = new Set();
                guildRateSet.set(msg.channel.id, channelRate);
            }, 1000);
        }
        channelRate.add(msg.author.id);
        if(channelRate.size() > rateLimit) {
            msg.channel.setRateLimitPerUser(slowModeTimer * severity, `Lotus has detected a peculiar spike in activity. Slow mode activated. Severity level: ${severity}`);
            severity ++;
            return;
        } else {
            severity > 1 ? severity-- : null
        }
        guildRateSet.set(msg.channel.id, channelRate);
    }
    if(msg.mentions.users.size > 0) {
        msg.mentions.users.map( (user) => {
            if(user.bot) {
                if(user.id == lotus.user.client.id) {
                    try {
                        // Rate limiting check
                        // Sliding window search text for predefined commands.
                        // moderation: kick, ban, mute, timeout (no text chat/reactions), disable video, mention
                        //
                    } catch ( error ) {
                        //error logging here. rolling log file to write to.
                    }
                }
            }
        })
    } else {
        //Regular text message, filter here for some bad words, delete message, message reason, then kick? (Words that really should have no warnings issued.)
        return;
    }
    

});
