const axios = require('axios')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {

        const guildvcsettings = await axios.get('http://127.0.0.1:8000/voicechannels/', {"data": {"id": oldState.guild.id}})

        //Check for disconnect
        if (newState.channelId == null) {
            response = await axios.get('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": oldState.channelId}}).catch(function (error){ return; })
            if (response) {
                newState.guild.channels.fetch(response['data']['channel_id']).then(async (channel) => {
                    if (channel.members.size < 1) {
                        channel.delete();
                    };
                });
            }
        } else if (newState.channelId != oldState.channelId) {
            if (newState.channelId == guildvcsettings['data']['channel_id']) {
                channel = newState.guild.channels.create(`${newState.member.user.username}'s Voice Chat`, {type: 'GUILD_VOICE'}).then(async (channel) => {
                    await axios.post('http://127.0.0.1:8000/voicechannels/channel/', {
                            "guild_id": newState.guild.id,
                            "channel_id": channel.id,
                            "owner": newState.member.id
                        });
                    newState.setChannel(channel);
                });
            };
        };
    },
};