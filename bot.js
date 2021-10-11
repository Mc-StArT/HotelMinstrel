const Discord = require('discord.js');
const {
    createAudioPlayer, 
    NoSubscriberBehavior, 
    createAudioResource, 
    joinVoiceChannel, 
    AudioPlayer, 
    VoiceConnection, 
    getVoiceConnection
} = require('@discordjs/voice');
const {
    prefix,
    discord_token,
} = require('./config.json');
const ytdl = require('ytdl-core');

var queue = []
var first = true

const allIntents = new Discord.Intents(32767)
const client = new Discord.Client({ intents: allIntents });
client.login(discord_token);



const audioPlayer = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
// const resource = createAudioResource();



client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;


    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, queue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, queue);
        return;
    } else if (message.content.startsWith(`${prefix}connect`)) {
        await connect(message);
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
async function execute(msg, queue) {
    
    // console.log(msg.content.split(" ")[1])
    const songInfo = await ytdl.getInfo(msg.content.split(" ")[1]);
    // console.log(songInfo)
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
    await queue.push(song)
    if (audioPlayer.state.status == "idle") {
        // console.log(queue[0])
        var next = queue.shift()
        var stream = await ytdl(next.url, { filter:'audioonly' })
        // console.log(next.url)
        var nextRes = await createAudioResource(stream,  { seek: 0, volume: 1 })
        
        audioPlayer.play(nextRes)
    }
    console.log(audioPlayer.state) 
}

// audioPlayer.on("stateChange", (oldState, newState) => {
//     if (audioPlayer.state.status  == "idle")  {
//         audioPlayer.play(createAudioResource(queue.shift()[1]))
//     }
// })

async function connect(msg) {
    const voiceChannel = msg.member.voice.channel
    if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return msg.channel.send('I need the permissions to join and   speak in your voice channel!');
    }
    const connection = await joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
    connection.subscribe(audioPlayer)
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