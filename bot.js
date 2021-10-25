const Discord = require('discord.js')
const {
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayer,
    VoiceConnection,
    getVoiceConnection
} = require('@discordjs/voice')
const { prefix } = require('./config.json')
const { discord_token } = require('./discord_token.json')
const ytdl = require('ytdl-core')
const { LoopState, CreateSongEmbed } = require('./modernComms')

var queue = []
var current = null
/**@type {Discord.TextBasedChannels} */
var textChannel = null
var loopState = LoopState.OFF

const allIntents = new Discord.Intents(32767)
const client = new Discord.Client({ intents: allIntents })
client.login(discord_token)

const commands = {
    play: execute,
    skip,
    connect,
    stop
}

const audioPlayer = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
    }
})

audioPlayer.on('error', (error) => {
    console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`)
    if (textChannel) {
        textChannel.send(`Error: ${error.message} with resource ${error.resource.metadata.title}`)
    }
    playNext()
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return

    if (!message.content.startsWith(prefix)) return
    let msg = message.content
    let command =
        commands[
            `${msg.slice(msg.indexOf(prefix) /* probably have to add -1 here */, prefix.length)}`
        ]
    if (command) {
        await command(message, queue)
        message.delete()
        // console.log('/connect got') // move this one to the connect function
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
    const songInfo = await ytdl.getInfo(msg.content.split(' ')[1])
    // console.log(songInfo)
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        info: songInfo
    }
    await queue.push(song)
    if (audioPlayer.state.status == 'idle') {
        // console.log(queue[0])
        playNext()
    }
    // console.log(audioPlayer.state)
}

audioPlayer.on('stateChange', (oldState, newState) => {
    if (audioPlayer.state.status == 'idle') {
        playNext()
    }
})
/**
 *
 * @param {Discord.Message} msg
 * @returns
 */
async function connect(msg) {
    textChannel = msg.channel
    const voiceChannel = msg.member.voice.channel
    if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to play music!')
    const permissions = voiceChannel.permissionsFor(msg.client.user)
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return msg.channel.send('I need the permissions to join and   speak in your voice channel!')
    }
    const connection = await joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
    connection.subscribe(audioPlayer)
}
async function skip(msg) {
    playNext()
}

async function playNext() {
    if (queue[0]) {
        switch (loopState) {
            case LoopState.OFF: {
                break
            }
            case LoopState.QUEUE: {
                queue.push(current)
                break
            }
            case LoopState.TRACK: {
                queue.unshift(current)
                break
            }
        }
        current = queue.shift()
        var stream = await ytdl(current.url, { filter: 'audioonly' })
        // console.log(next.url)
        var Res = await createAudioResource(stream, {
            seek: 0,
            volume: 1,
            metadata: {
                title: current.title
            }
        })

        audioPlayer.play(Res)
        let embed = CreateSongEmbed(current)
        console.log(embed)
        textChannel.send({ embeds: [embed] })
    } else {
        textChannel.send('No more songs to sing')
        audioPlayer.stop()
    }
}

client.once('ready', () => {
    console.log('Ready!')
})

client.once('reconnecting', () => {
    console.log('Reconnecting!')
})

client.once('disconnect', () => {
    console.log('Disconnect!')
})
