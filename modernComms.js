const Discord = require('discord.js');
const {
    createAudioPlayer, 
    NoSubscriberBehavior, 
    createAudioResource, 
    joinVoiceChannel, 
    AudioPlayer, 
    VoiceConnection 
} = require('@discordjs/voice');

function execute()