const Discord = require('discord.js');
const {
    createAudioPlayer, 
    NoSubscriberBehavior, 
    createAudioResource, 
    joinVoiceChannel, 
    AudioPlayer, 
    VoiceConnection 
} = require('@discordjs/voice');
const {
    prefix,
    discord_token,
} = require('./config.json');
const ytdl = require('ytdl-core');




const allIntents = new Discord.Intents(32767)
const client = new Discord.Client({ intents: allIntents });
client.login(discord_token);



const audioPlayer = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
const resource = createAudioResource();



client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;


    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, queue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, queue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, queue);
        return;
    } else {
        message.channel.send('You need to enter a valid command!')
    }
})
/**
 * 
 * @param {Discord.Message} msg 
 * @param {Array} queue 
 */
function execute(msg, queue) {
    songName = msg.content.split(" ")
    queue.push(songName)
    console.log(audioPlayer.state) 
}











client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});