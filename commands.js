const Discord = require("discord.js")
const ytdl = require('ytdl-core');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel, AudioPlayer, VoiceConnection } = require('@discordjs/voice');


/**
 * 
 * @param {Discord.Message} message 
 * @param {*} serverQueue 
 * @returns 
 */

async function execute(message, serverQueue, queue) {
    const args = message.content.split(' ');
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and   speak in your voice channel!');
    }
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };
    if (!serverQueue) {
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });


        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: VoiceConnection,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild.id, queueContruct);
        // Pushing the song to our songs array
        queueContruct.songs.push(song);
        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        })
        try {
            // Here we try to join the voicechat and save our connection into our object.
            
            queueContruct.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueContruct.songs[0], queue, player);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}
/**
 * 
 * @param {Discord.Guild} guild 
 * @param {*} song 
 * @param {*} queue 
 * @param {AudioPlayer} player 
 * @returns 
 */
function play(guild, song, queue, player) {
    var resource = createAudioResource(song);
    player.play(resource)
    connection.subscribe(player)
    while (player.state == "")
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    // const audioPlayer = serverQueue.connection.createAudioPlayer()
    // audioPlayer.play(ytdl(song.url))
    //     .on('end', () => {
    //         console.log('Music ended!');
    //         player.stop();
    //         // Deletes the finished song from the queue
    //         serverQueue.songs.shift();
    //         // Calls the play function again with the next song
    //         play(guild, serverQueue.songs[0], queue, player);
    //     })
    //     .on('error', error => {
    //         console.error(error);
    //     });





    // const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    //     .on('end', () => {
    //         console.log('Music ended!');
    //         // Deletes the finished song from the queue
    //         serverQueue.songs.shift();
    //         // Calls the play function again with the next song
    //         play(guild, serverQueue.songs[0]);
    //     })
    //     .on('error', error => {
    //         console.error(error);
    //     });


    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

module.exports = {
    execute
}