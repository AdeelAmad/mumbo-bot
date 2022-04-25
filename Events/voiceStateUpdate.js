const axios = require('axios')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {

        guildsettings = await axios.get('http://127.0.0.1:8000/management/', {"data": {"id": newState.guild.id}})

        const guildvcsettings = await axios.get('http://127.0.0.1:8000/voicechannels/', {"data": {"id": oldState.guild.id}})
        //Check for disconnect
        if (newState.channelId == null) {
            vcresponse = await axios.get('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": oldState.channelId}}).catch(function (error) {
                return;
            })
            if (vcresponse) {
                newState.guild.channels.fetch(vcresponse['data']['channel_id']).then(async (channel) => {
                    if (channel.members.size < 1) {
                        await axios.delete('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": channel.id}});
                        channel.delete();
                    } else if (vcresponse['data']['owner'] == newState.member.id) {
                        reassigned = false;
                        for (member of channel.members) {
                            if (!member[1].user.bot) {
                                await axios.put('http://127.0.0.1:8000/voicechannels/channel/', {
                                    "channel_id": channel.id,
                                    "owner": member[0]
                                });
                                reassigned = true;
                                break;
                            };
                        };
                        if (!reassigned) {
                            await axios.delete('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": channel.id}});
                            channel.delete();
                        };
                    };
                });
            };
        } else if (newState.channelId != oldState.channelId) {
            if (newState.channelId == guildvcsettings['data']['channel_id']) {
                if (guildsettings['data']['voicechannel']) {
                    channel = newState.guild.channels.create(`${newState.member.user.username}'s Voice Chat`, {
                        type: 'GUILD_VOICE',
                        bitrate: newState.guild.maximumBitrate
                    }).then(async (channel) => {
                        channel.setParent(guildvcsettings['data']['category'].toString()).catch(function (error) {
                            return;
                        });
                        await axios.post('http://127.0.0.1:8000/voicechannels/channel/', {
                            "guild_id": newState.guild.id,
                            "channel_id": channel.id,
                            "owner": newState.member.id
                        });
                        newState.setChannel(channel);
                    });
                };
            } else {
                vcresponse = await axios.get('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": oldState.channelId}}).catch(function (error) {
                    return;
                })
                if (vcresponse) {
                    newState.guild.channels.fetch(vcresponse['data']['channel_id']).then(async (channel) => {
                        if (channel.members.size < 1) {
                            await axios.delete('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": channel.id}});
                            channel.delete();
                        } else if (vcresponse['data']['owner'] == newState.member.id) {
                            reassigned = false;
                            for (member of channel.members) {
                                if (!member[1].user.bot) {
                                    await axios.put('http://127.0.0.1:8000/voicechannels/channel/', {
                                        "channel_id": channel.id,
                                        "owner": member[0]
                                    });
                                    reassigned = true;
                                    break;
                                };
                            };
                            if (!reassigned) {
                                await axios.delete('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": channel.id}});
                                channel.delete();
                            };
                        };
                    });
                };
            };
        };
    },
};