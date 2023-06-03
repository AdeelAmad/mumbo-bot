const axios = require('axios')
const { ChannelType } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection, generateDependencyReport } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType  } = require('@discordjs/voice');
const { createReadStream } = require('node:fs');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {

        guildsettings = await axios.get('https://api.agradehost.com/management/', {"data": {"id": newState.guild.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

        const guildvcsettings = await axios.get('https://api.agradehost.com/voicechannels/', {"data": {"id": oldState.guild.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})
        //Check for disconnect
        if (newState.channelId == null) {

            vcresponse = await axios.get('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": oldState.channelId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) {
                return;
            });

            if (vcresponse) {
                newState.guild.channels.fetch(vcresponse['data']['channel_id']).then(async (channel) => {
                    if (channel.members.size < 1) {
                        await axios.delete('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": channel.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                        channel.delete();
                    } else if (vcresponse['data']['owner'] == newState.member.id) {
                        reassigned = false;
                        for (member of channel.members) {
                            if (!member[1].user.bot) {
                                await axios.put('https://api.agradehost.com/voicechannels/channel/', {
                                    "channel_id": channel.id,
                                    "owner": member[0]
                                }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                                reassigned = true;
                                break;
                            };
                        };
                        if (!reassigned) {
                            channel.delete();
                            await axios.delete('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": channel.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                        };
                    };
                });
            };
        } else if (newState.channelId != oldState.channelId) {
            if (newState.channelId == guildvcsettings['data']['channel_id']) {
                if (guildsettings['data']['voicechannel']) {
                    if (!newState.member.user.bot) {
                        channel = newState.guild.channels.create({
                            name: `${newState.member.user.username}'s Voice Chat`,
                            type: ChannelType.GuildVoice,
                            bitrate: newState.guild.maximumBitrate
                        }).then(async (channel) => {
                            channel.setParent(guildvcsettings['data']['category'].toString()).catch(function (error) {
                                return;
                            });
                            await axios.post('https://api.agradehost.com/voicechannels/channel/', {
                                "guild_id": newState.guild.id,
                                "channel_id": channel.id,
                                "owner": newState.member.id
                            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            newState.setChannel(channel).catch(async function (error) {
                                channel.delete();
                                await axios.delete('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": channel.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            });
                        });
                    };
                };
            } else {
                vcresponse = await axios.get('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": oldState.channelId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) {
                    return;
                })
                if (vcresponse) {
                    newState.guild.channels.fetch(vcresponse['data']['channel_id']).then(async (channel) => {
                        if (channel.members.size < 1) {
                            await axios.delete('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": channel.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            channel.delete();
                        } else if (vcresponse['data']['owner'] == newState.member.id) {
                            reassigned = false;
                            for (member of channel.members) {
                                if (!member[1].user.bot) {
                                    await axios.put('https://api.agradehost.com/voicechannels/channel/', {
                                        "channel_id": channel.id,
                                        "owner": member[0]
                                    }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                                    reassigned = true;
                                    break;
                                };
                            };
                            if (!reassigned) {
                                channel.delete();
                                await axios.delete('https://api.agradehost.com/voicechannels/channel/', {"data": {"id": channel.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            };
                        };
                    });
                };
            };
        };

        if (guildsettings['data']['afkmusic']) {
            if (newState.guild.afkChannelId == newState.channelId) {
                if (newState.channel != oldState.channel) {
                    if (!newState.member.user.bot) {
                        if (getVoiceConnection(newState.guild.id)) {
                            getVoiceConnection(newState.guild.id).rejoin();
                            newState.guild.members.fetch('744992005158862939').then((member) => {
                                member.edit({mute: false, deaf: true}).catch(function (error){return;});
                            });
                        } else {
                            if (newState.guild.afkChannelId != null) {
                                const player = createAudioPlayer();

                                const resource = createAudioResource(createReadStream('./Events/audio/afk.mp3', {
                                    inputType: StreamType.OggOpus,
                                }));

                                player.play(resource);

                                player.on('idle', () => {
                                    const resource = createAudioResource(createReadStream('./Events/audio/afk.mp3', {
                                        inputType: StreamType.OggOpus,
                                    }));
                                    player.play(resource);
                                });

                                const connection = joinVoiceChannel({
                                    channelId: newState.guild.afkChannelId,
                                    guildId: newState.guild.id,
                                    adapterCreator: newState.guild.voiceAdapterCreator,
                                });

                                newState.guild.members.fetch('744992005158862939').then((member) => {
                                    member.edit({mute: false, deaf: true}).catch(function (error) {
                                        return;
                                    });
                                });

                                const subscription = connection.subscribe(player);
                            };
                        };
                    };
                };
            };
        };
    },
};