const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcreatechannel')
        .setDescription('Sets the channel for the bot to monitor for voice channel creation')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel to set for voice channel creation').setRequired(true)),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Successfully set ${interaction.options.getChannel('channel')} to the create channel.`)

            //Mumbo website link
            .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://deelio.gitbook.io/mumbo-afk/'})
            .setTimestamp()

        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const response = await axios.get('http://127.0.0.1:8000/voicechannels/', {"data": {"id": interaction.guildId}})

            axios.put('http://127.0.0.1:8000/voicechannels/', {
                "id": interaction.guildId,
                "channel_id": interaction.options.getChannel('channel')['id'],
                "category": response['data']['category'],
                "bitrate": response['data']['bitrate']
            })

            await interaction.reply({embeds: [setEmbed]});
        } else {
            await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
        }
    },
};