module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        //Check is the new channel is the AFK channel
        if (newState.channelId == newState.guild.afkChannelId) {
            console.log(`${oldState.member.nickname} in #${newState.guild.name} triggered a voice state update.`);
        }
    },
};