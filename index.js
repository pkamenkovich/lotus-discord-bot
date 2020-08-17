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
    if(!msg.author.hasPermission("ADMINISTRATOR")) {
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
            msg.channel.setRateLimitPerUser(slowModeTimer * severity, `Lotus has detected a peculiar spike in activity. Severity level: ${severity}`);
            severity ++;
            return;
        } else {
            severity > 1 ? severity-- : null
            msg.channel.setRateLimitPerUser(slowModeTimer * severity, `Lotus has increased the rate limit per user. Severity level: ${severity}`);
        }
        guildRateSet.set(msg.channel.id, channelRate);
    }
    if(msg.mentions.users.size > 0) {
        msg.mentions.users.map( (user) => {
            if(user.bot) {
                if(user.id == lotus.user.id) {
                    try {
                        // Command Rate limiting check
                        let messageArray = msg.content.split(" ");
                        messageArray.map( (word) => {
                            if(lotus.commands.has(word)) {
                                lotus.commands.get(word).execute(msg, messageArray);
                                return;
                            } 
                        });
                    } catch ( error ) {
                        //error logging here. rolling log file to write to.
                        console.log(error);
                    }
                }
            }
        })
    } else {
        //Regular text message, filter here for some bad words, delete message, message reason, then kick? (Words that really should have no warnings issued.)
        return;
    }
    

});
