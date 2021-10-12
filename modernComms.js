const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {
    createAudioPlayer, 
    NoSubscriberBehavior, 
    createAudioResource, 
    joinVoiceChannel, 
    AudioPlayer, 
    VoiceConnection 
} = require('@discordjs/voice');
const LoopState = {
    OFF: 1, 
    QUEUE: 2,
    TRACK: 3
}

function CreateSongEmbed(songInfo) {
    let embed = new Discord.MessageEmbed()
    /**@type {ytdl.videoInfo} */
    var info = songInfo.info
    embed.setAuthor("Ministrel",  "https://i.imgur.com/Px6Aqdq.jpg")
    embed.setTitle(info.videoDetails.title)
    embed.addField("Duration: ", info.videoDetails.lengthSeconds)
    console.log(embed)
    return embed

}
module.exports= {
    LoopState,
    CreateSongEmbed
    
}