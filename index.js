const Discord = require('discord.js');
const {
    prefix,
    discord_token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const { execute } = require("./commands")
const allIntents = new Discord.Intents(32767)

const client = new Discord.Client({ intents: allIntents });
client.login(discord_token);

const queue = new Map();

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;


    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue, queue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send('You need to enter a valid command!')
    }
})








client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});