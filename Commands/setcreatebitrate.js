const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcreatebitrate')
        .setDescription('Sets the bitrate for voice channels to be created with')
        .addIntegerOption(option => option.setName('bitrate').setDescription('Select a category for voice channels to be created with').setRequired(true)),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Successfully set ${interaction.options.getInteger('bitrate')} to the create bitrate.`)

            //Mumbo website link
            .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://mumbobot.xyz/commands/'})
            .setTimestamp()

        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const response = await axios.get('https://api.mumbobot.xyz/voicechannels/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

            axios.put('https://api.mumbobot.xyz/voicechannels/', {
                "id": interaction.guildId,
                "channel_id": response['data']['channel_id'],
                "category": response['data']['category'],
                "bitrate": interaction.options.getInteger('bitrate')
            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

            await interaction.reply({embeds: [setEmbed]});
        } else {
            await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
        }
    },
};