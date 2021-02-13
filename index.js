require('dotenv').config();
const Discord = require('discord.js');
const lotus = new Discord.Client();
lotus.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(command => {
    lotus.commands.set(botCommands[command].name, botCommands[command]);
});

let state = {
    muted: new Map()
};

const TOKEN = process.env.TOKEN;

lotus.login(TOKEN);

lotus.on('ready', () => {
    console.info(`Logged in as ${lotus.user.tag}!`);
});

lotus.on('message', msg => {
    if(msg.mentions.users.size > 0) {
        msg.mentions.users.map( (user) => {
            if(user.bot) {
                if(user.id == lotus.user.id) {
                    try {
                        let messageArray = msg.content.split(" ");
                        messageArray.map( (word) => {
                            if(lotus.commands.has(word)) {
                                lotus.commands.get(word).execute(msg, messageArray, state);
                                return;
                            } 
                        });
                    } catch ( error ) {
                        console.log(error);
                    }
                }
            }
        })
    } else {
        return;
    }
    

});
